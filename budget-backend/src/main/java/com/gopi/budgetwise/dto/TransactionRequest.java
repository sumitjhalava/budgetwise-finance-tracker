package com.gopi.budgetwise.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class TransactionRequest {

    @NotNull
    public Long userId;

    @NotNull
    public String type; // INCOME or EXPENSE

    @NotNull
    public Double amount;

    @NotNull
    public String category;

    public String description;

    public LocalDate date;
}
