package com.app.financeTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileRequestDto {
    private Double monthlyIncome;
    private String financialGoal;
    private Double savingTarget;
    private String currency;
}
