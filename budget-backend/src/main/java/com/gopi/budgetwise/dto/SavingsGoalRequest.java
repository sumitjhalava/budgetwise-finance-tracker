package com.gopi.budgetwise.dto;

import java.time.LocalDate;

public class SavingsGoalRequest {
    public Long userId;
    public String name;
    public Double targetAmount;
    public Double currentAmount;
    public LocalDate deadline;
}
