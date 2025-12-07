package com.app.financeTracker.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileResponseDto {

    private Double monthlyIncome;
    private Double savingTarget;
    private String financialGoal;
    private String currency;
}
