package com.budgetwise.dto;

import lombok.Data;

@Data
public class MonthlySummaryDto {
    private int year;
    private int month;
    private Double totalIncome;
    private Double totalExpenses;
    private Double balance;
    private Double avgDailyExpense;
    private LargestExpenseDto largestExpense;
    
    @Data
    public static class LargestExpenseDto {
        private Long id;
        private String description;
        private Double amount;
        private String date;
    }
}