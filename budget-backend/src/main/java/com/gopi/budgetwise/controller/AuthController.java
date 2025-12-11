package com.gopi.budgetwise.controller;

import com.gopi.budgetwise.dto.*;
import com.gopi.budgetwise.entity.User;
import com.gopi.budgetwise.repository.UserRepository;
import com.gopi.budgetwise.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authManager,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {

        if (userRepository.findByEmail(req.email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        User u = new User();
        u.name = req.name;
        u.email = req.email;
        u.password = passwordEncoder.encode(req.password);
        u.role = "ROLE_USER";
        u.monthlyIncome = req.monthlyIncome;
        u.monthlyTargetExpenses = req.monthlyTargetExpenses;
        u.savingsTarget = req.savingsTarget;

        userRepository.save(u);
        return ResponseEntity.ok("Registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email, req.password)
        );

        String token = jwtService.generateToken(req.email);
        User u = userRepository.findByEmail(req.email).get();

        AuthResponse resp = new AuthResponse();
        resp.token = token;
        resp.userId = u.id;
        resp.name = u.name;
        resp.email = u.email;
        resp.role = u.role;

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/me")
    public ResponseEntity<?> profile(Principal principal) {
        Optional<User> opt = userRepository.findByEmail(principal.getName());
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("User not found");

        User u = opt.get();
        ProfileResponse resp = new ProfileResponse();
        resp.id = u.id;
        resp.name = u.name;
        resp.email = u.email;
        resp.role = u.role;
        resp.monthlyIncome = u.monthlyIncome;
        resp.monthlyTargetExpenses = u.monthlyTargetExpenses;
        resp.savingsTarget = u.savingsTarget;

        return ResponseEntity.ok(resp);
    }
}
