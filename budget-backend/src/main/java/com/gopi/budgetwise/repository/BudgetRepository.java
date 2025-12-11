package com.gopi.budgetwise.repository;

import com.gopi.budgetwise.entity.Budget;
import com.gopi.budgetwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserAndMonthAndYear(User user, Integer month, Integer year);
}
