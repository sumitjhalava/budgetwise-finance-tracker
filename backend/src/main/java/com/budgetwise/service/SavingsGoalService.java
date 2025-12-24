package com.budgetwise.service;

import java.time.LocalDate;
import java.util.List;

import com.budgetwise.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.budgetwise.model.User;
import com.budgetwise.repository.SavingsGoalRepository;

import com.budgetwise.model.SavingsGoal;
import com.budgetwise.dto.*;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final TransactionRepository transactionRepository;

    public SavingsGoalResponse createGoal(User user, SavingsGoalRequest dto) {

        SavingsGoal goal = new SavingsGoal();
        goal.setName(dto.getName());
        goal.setTargetAmount(dto.getTargetAmount());
        goal.setTargetDate(dto.getTargetDate());
        goal.setStartDate(LocalDate.now());
        goal.setUser(user);

        SavingsGoal savedGoal = savingsGoalRepository.save(goal);
        return mapToResponse(savedGoal, user);
    }

    public List<SavingsGoalResponse> getAllGoals(User user) {
        return savingsGoalRepository.findByUser(user)
                .stream()
                .map(goal -> mapToResponse(goal, user))
                .toList();
    }

    public SavingsGoalResponse updateGoal(Long id, User user, SavingsGoalRequest dto) {

        SavingsGoal goal = savingsGoalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Savings goal not found"
                ));

        goal.setName(dto.getName());
        goal.setTargetAmount(dto.getTargetAmount());
        goal.setTargetDate(dto.getTargetDate());

        return mapToResponse(savingsGoalRepository.save(goal), user);
    }

    public void deleteGoal(Long id, User user) {

        SavingsGoal goal = savingsGoalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Savings goal not found"
                ));

        savingsGoalRepository.delete(goal);
    }

    private SavingsGoalResponse mapToResponse(SavingsGoal goal, User user) {

        Double income = transactionRepository.sumAmountByUserAndType(user, "income");
        Double expense = transactionRepository.sumAmountByUserAndType(user, "expense");

        double totalIncome = income != null ? income : 0.0;
        double totalExpense = expense != null ? expense : 0.0;

        double savedAmount = Math.max(totalIncome - totalExpense, 0);
        double remainingAmount = Math.max(goal.getTargetAmount() - savedAmount, 0);

        return new SavingsGoalResponse(
                goal.getId(),
                goal.getName(),
                goal.getTargetAmount(),
                goal.getStartDate(),
                goal.getTargetDate(),
                savedAmount,
                remainingAmount
        );
    }
}

