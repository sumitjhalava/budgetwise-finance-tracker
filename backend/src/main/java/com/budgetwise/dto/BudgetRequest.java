package com.budgetwise.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class BudgetRequest {
    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Budget limit is required")
    @DecimalMin(value = "0.01", message = "Budget limit must be greater than 0")
    private Double budgetLimit;
}
