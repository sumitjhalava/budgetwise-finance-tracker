package com.gopi.budgetwise.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "forum_posts")
public class ForumPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @Column(nullable = false)
    public String title;

    @Column(nullable = false, length = 2000)
    public String content;

    public LocalDateTime createdAt = LocalDateTime.now();

    public Integer likes = 0;
}

