package com.budgetwise.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TransactionRequest {
    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private Double amount;

    @NotBlank(message = "Type is required")
    @Pattern(regexp = "income|expense", message = "Type must be income or expense")
    private String type;

    @NotBlank(message = "Category is required")
    private String category;

    private LocalDate date;
}