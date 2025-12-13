package com.budgetwise.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {
    private Long id;
    private String description;
    private Double amount;
    private String type;
    private String category;
    private String predictedCategory;
    private String categorySource;

    private LocalDate date;
    private LocalDateTime createdAt;
}