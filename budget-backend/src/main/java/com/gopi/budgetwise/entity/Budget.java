package com.gopi.budgetwise.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "category", "month", "year"}))
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @Column(nullable = false)
    public String category; // Food, Rent, etc.

    @Column(nullable = false)
    public Integer month; // 1-12

    @Column(nullable = false)
    public Integer year;

    @Column(nullable = false)
    public Double amount; // monthly budget for that category
}
