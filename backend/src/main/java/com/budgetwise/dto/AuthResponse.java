package com.budgetwise.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Getter
@Setter
@EqualsAndHashCode
@ToString(exclude = "token")
public class AuthResponse {
    private String token;
    private String email;
    private String name;
}
