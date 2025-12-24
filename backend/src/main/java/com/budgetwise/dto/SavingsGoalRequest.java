package com.budgetwise.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Data
public class SavingsGoalRequest {

    @NotBlank(message = "Goal name is required")
    private String name;

    @NotNull(message = "Target amount is required")
    @DecimalMin(value = "0.01", message = "Target amount must be greater than 0")
    private Double targetAmount;

    // Optional
    private LocalDate targetDate;
}


