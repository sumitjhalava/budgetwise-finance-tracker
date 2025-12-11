package com.gopi.budgetwise.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String name;

    @Column(nullable = false, unique = true)
    public String email;

    @Column(nullable = false)
    public String password; // hashed

    @Column(nullable = false)
    public String role; // "ROLE_USER" or "ROLE_ADMIN"

    // Profile fields:
    public Double monthlyIncome;
    public Double monthlyTargetExpenses;
    public Double savingsTarget;

    public User() {
    }

    public User(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
