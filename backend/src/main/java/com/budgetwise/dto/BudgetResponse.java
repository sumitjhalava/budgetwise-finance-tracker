package com.budgetwise.dto;

import lombok.Data;

@Data
public class BudgetResponse {
    private Long id;
    private String category;
    private Double budgetLimit;
}
