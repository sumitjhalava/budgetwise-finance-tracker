package com.budgetwise.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@AllArgsConstructor
public class SavingsGoalResponse {

    private Long id;
    private String name;

    private Double targetAmount;

    private LocalDate startDate;
    private LocalDate targetDate;

    private Double savedAmount;
    private Double remainingAmount;

}
