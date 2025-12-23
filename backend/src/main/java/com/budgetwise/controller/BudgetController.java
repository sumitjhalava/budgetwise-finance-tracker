package com.budgetwise.controller;

import com.budgetwise.dto.BudgetRequest;
import com.budgetwise.dto.BudgetResponse;
import com.budgetwise.model.Budget;
import com.budgetwise.model.User;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetService budgetService;
    private final UserRepository userRepository;

    public BudgetController(BudgetService budgetService, UserRepository userRepository) {
        this.budgetService = budgetService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        List<BudgetResponse> budgets = budgetService.getBudgetsForUser(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(budgets);
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> addOrUpdateBudget(@Valid @RequestBody BudgetRequest req, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        Budget budget = budgetService.saveOrUpdateBudget(user, req.getCategory(), req.getBudgetLimit());
        return ResponseEntity.ok(toResponse(budget));
    }

    @DeleteMapping("/{category}")
    public ResponseEntity<Void> deleteBudget(@PathVariable String category, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        // Decode the category in case it contains URL-encoded characters
        String decodedCategory = URLDecoder.decode(category, StandardCharsets.UTF_8);
        budgetService.deleteBudget(user, decodedCategory);
        return ResponseEntity.noContent().build();
    }

    private BudgetResponse toResponse(Budget budget) {
        BudgetResponse resp = new BudgetResponse();
        resp.setId(budget.getId());
        resp.setCategory(budget.getCategory());
        resp.setBudgetLimit(budget.getBudgetLimit());
        return resp;
    }
}
