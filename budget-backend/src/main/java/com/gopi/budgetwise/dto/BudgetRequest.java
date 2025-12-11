package com.gopi.budgetwise.dto;

import jakarta.validation.constraints.NotNull;

public class BudgetRequest {

    @NotNull
    public Long userId;

    @NotNull
    public String category;

    @NotNull
    public Integer month;

    @NotNull
    public Integer year;

    @NotNull
    public Double amount;
}
