package com.gopi.budgetwise.controller;

import com.gopi.budgetwise.entity.Transaction;
import com.gopi.budgetwise.entity.User;
import com.gopi.budgetwise.repository.TransactionRepository;
import com.gopi.budgetwise.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    private final TransactionRepository txRepo;
    private final UserRepository userRepo;

    public ReportController(TransactionRepository t, UserRepository u) {
        this.txRepo = t;
        this.userRepo = u;
    }

    @GetMapping("/summary/{userId}/{year}/{month}")
    public ResponseEntity<?> monthlySummary(@PathVariable Long userId,
                                            @PathVariable int year,
                                            @PathVariable int month) {
        User u = userRepo.findById(userId).orElse(null);
        if (u == null) return ResponseEntity.badRequest().body("User not found");

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Transaction> txs = txRepo.findByUserAndDateBetween(u, start, end);

        double totalIncome = 0, totalExpense = 0;
        Map<String, Double> categoryExpense = new HashMap<>();

        for (Transaction t : txs) {
            if ("INCOME".equalsIgnoreCase(t.type)) {
                totalIncome += t.amount;
            } else if ("EXPENSE".equalsIgnoreCase(t.type)) {
                totalExpense += t.amount;
                categoryExpense.put(t.category,
                        categoryExpense.getOrDefault(t.category, 0.0) + t.amount);
            }
        }

        Map<String, Object> res = new HashMap<>();
        res.put("totalIncome", totalIncome);
        res.put("totalExpense", totalExpense);
        res.put("net", totalIncome - totalExpense);
        res.put("categoryExpense", categoryExpense);

        return ResponseEntity.ok(res);
    }
}
