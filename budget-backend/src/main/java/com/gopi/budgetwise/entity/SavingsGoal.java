package com.gopi.budgetwise.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "savings_goals")
public class SavingsGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @Column(nullable = false)
    public String name; // e.g., "New Laptop"

    @Column(nullable = false)
    public Double targetAmount;

    @Column(nullable = false)
    public Double currentAmount = 0.0;

    public LocalDate deadline;
}
