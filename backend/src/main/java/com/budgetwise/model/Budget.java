package com.budgetwise.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "budgets", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "category"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Budget limit is required")
    @DecimalMin(value = "0.01", message = "Budget limit must be greater than 0")
    @Column(name = "budget_limit")
    private Double budgetLimit;
}
