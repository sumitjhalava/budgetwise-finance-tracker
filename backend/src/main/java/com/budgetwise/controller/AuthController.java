package com.budgetwise.controller;

import com.budgetwise.dto.AuthRequest;
import com.budgetwise.dto.AuthResponse;
import com.budgetwise.model.User;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.budgetwise.dto.ForgotPasswordRequest;
import com.budgetwise.dto.ResetPasswordRequest;
import com.budgetwise.model.PasswordResetToken;
import com.budgetwise.repository.PasswordResetTokenRepository;

import java.time.LocalDateTime;
import java.util.UUID;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, PasswordResetTokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.tokenRepository = tokenRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody User user) {
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(saved.getEmail());
        AuthResponse resp = new AuthResponse();
        resp.setToken(token);
        resp.setEmail(saved.getEmail());
        resp.setName(saved.getName());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        User user = userOpt.get();
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtUtil.generateToken(user.getEmail());
        AuthResponse resp = new AuthResponse();
        resp.setToken(token);
        resp.setEmail(user.getEmail());
        resp.setName(user.getName());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // remove old token if exists
        tokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));

        tokenRepository.save(resetToken);

        // for now return link
        String resetLink =
                "http://localhost:3000/reset-password?token=" + token;

        return ResponseEntity.ok(resetLink);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        PasswordResetToken token = tokenRepository
                .findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Token expired");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenRepository.delete(token); // one-time use

        return ResponseEntity.ok("Password updated successfully");
    }


}
