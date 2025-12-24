package com.budgetwise.controller;

import com.budgetwise.dto.SavingsGoalRequest;
import com.budgetwise.dto.SavingsGoalResponse;
import com.budgetwise.model.User;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.service.SavingsGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;
    private final UserRepository userRepository;

    private User getUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User not found"
                ));
    }

    @PostMapping
    public SavingsGoalResponse createGoal(
            @Valid @RequestBody SavingsGoalRequest request,
            Authentication auth) {

        return savingsGoalService.createGoal(getUser(auth), request);
    }

    @PutMapping("/{goalId}")
    public SavingsGoalResponse updateGoal(
            @PathVariable Long goalId,
            @Valid @RequestBody SavingsGoalRequest request,
            Authentication auth) {

        return savingsGoalService.updateGoal(goalId, getUser(auth), request);
    }

    @GetMapping
    public List<SavingsGoalResponse> getAllGoals(Authentication auth) {
        return savingsGoalService.getAllGoals(getUser(auth));
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(
            @PathVariable Long goalId,
            Authentication auth) {

        savingsGoalService.deleteGoal(goalId, getUser(auth));
        return ResponseEntity.ok().build();
    }
}
