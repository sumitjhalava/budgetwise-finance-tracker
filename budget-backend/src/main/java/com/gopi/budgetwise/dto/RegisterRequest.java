package com.gopi.budgetwise.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank(message = "Name is required")
    public String name;


    @NotBlank(message = "Email is required")
    //@Email(message = "Enter a valid email address (example@domain.com)")
    @Pattern(
            regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
            message = "Enter a valid email address (example@domain.com)"
    )
    public String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    public String password;

    // profile
    public Double monthlyIncome;
    public Double monthlyTargetExpenses;
    public Double savingsTarget;

}
