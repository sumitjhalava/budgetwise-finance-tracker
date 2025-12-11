package com.gopi.budgetwise.controller;

import com.gopi.budgetwise.dto.BudgetRequest;
import com.gopi.budgetwise.entity.Budget;
import com.gopi.budgetwise.entity.Transaction;
import com.gopi.budgetwise.entity.User;
import com.gopi.budgetwise.repository.BudgetRepository;
import com.gopi.budgetwise.repository.TransactionRepository;
import com.gopi.budgetwise.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:3000")
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public BudgetController(BudgetRepository br,
                            TransactionRepository tr,
                            UserRepository ur) {
        this.budgetRepository = br;
        this.transactionRepository = tr;
        this.userRepository = ur;
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdate(@Valid @RequestBody BudgetRequest req) {
        User u = userRepository.findById(req.userId).orElse(null);
        if (u == null) return ResponseEntity.badRequest().body("User not found");

        List<Budget> list = budgetRepository.findByUserAndMonthAndYear(u, req.month, req.year);
        Budget b = list.stream()
                .filter(bb -> bb.category.equals(req.category))
                .findFirst()
                .orElse(new Budget());

        b.user = u;
        b.category = req.category;
        b.month = req.month;
        b.year = req.year;
        b.amount = req.amount;

        budgetRepository.save(b);
        return ResponseEntity.ok(b);
    }

    @GetMapping("/user/{userId}/{year}/{month}")
    public ResponseEntity<?> getBudgets(@PathVariable Long userId,
                                        @PathVariable Integer year,
                                        @PathVariable Integer month) {
        User u = userRepository.findById(userId).orElse(null);
        if (u == null) return ResponseEntity.badRequest().body("User not found");

        List<Budget> budgets = budgetRepository.findByUserAndMonthAndYear(u, month, year);

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        List<Transaction> txs = transactionRepository.findByUserAndDateBetween(u, start, end);

        Map<String, Double> spent = new HashMap<>();
        for (Transaction t : txs) {
            if ("EXPENSE".equalsIgnoreCase(t.type)) {
                spent.put(t.category, spent.getOrDefault(t.category, 0.0) + t.amount);
            }
        }

        // Response: list of objects: {category, budget, spent, remaining}
        List<Map<String, Object>> result = new ArrayList<>();
        for (Budget b : budgets) {
            double s = spent.getOrDefault(b.category, 0.0);
            Map<String, Object> row = new HashMap<>();
            row.put("category", b.category);
            row.put("budget", b.amount);
            row.put("spent", s);
            row.put("remaining", b.amount - s);
            result.add(row);
        }

        return ResponseEntity.ok(result);
    }
}
