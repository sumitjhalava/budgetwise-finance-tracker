package com.gopi.budgetwise.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank
    public String name;

    @Email
    @NotBlank
    public String email;

    @NotBlank
    @Size(min = 4)
    public String password;

    // profile
    public Double monthlyIncome;
    public Double monthlyTargetExpenses;
    public Double savingsTarget;
}
