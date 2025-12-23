package com.budgetwise.service;

import com.budgetwise.model.Budget;
import com.budgetwise.model.User;
import com.budgetwise.repository.BudgetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {
    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public List<Budget> getBudgetsForUser(User user) {
        return budgetRepository.findByUser(user);
    }

    public Optional<Budget> getBudgetByCategory(User user, String category) {
        return budgetRepository.findByUserAndCategory(user, category);
    }

    public Budget saveOrUpdateBudget(User user, String category, Double budgetLimit) {
        Optional<Budget> existing = budgetRepository.findByUserAndCategory(user, category);
        Budget budget = existing.orElse(new Budget());
        budget.setUser(user);
        budget.setCategory(category);
        budget.setBudgetLimit(budgetLimit);
        return budgetRepository.save(budget);
    }

    @Transactional
    public void deleteBudget(User user, String category) {
        Optional<Budget> existing = budgetRepository.findByUserAndCategory(user, category);
        if (existing.isPresent()) {
            budgetRepository.delete(existing.get());
        } else {
            throw new IllegalArgumentException("No budget found for category: " + category);
        }
    }
}
