package com.budgetwise.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@EqualsAndHashCode
@ToString(exclude = "token")
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private Long userId; // Added userId
    private String message;

    public AuthResponse(String token, String email, String name, Long userId) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.userId = userId;
    }
}
