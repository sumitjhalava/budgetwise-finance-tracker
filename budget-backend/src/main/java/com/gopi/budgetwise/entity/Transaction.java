package com.gopi.budgetwise.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    // INCOME or EXPENSE
    @Column(nullable = false)
    public String type;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @Column(nullable = false)
    public Double amount;

    @Column(nullable = false)
    public String category; // Rent, Food, Travel...

    public String description;

    @Column(nullable = false)
    public LocalDate date;
}

