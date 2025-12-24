package com.budgetwise.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.budgetwise.model.SavingsGoal;
import com.budgetwise.model.User;

import java.util.Optional;

@Repository
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {

    List<SavingsGoal> findByUser(User user);

    Optional<SavingsGoal> findByIdAndUser(Long id, User user);
}

