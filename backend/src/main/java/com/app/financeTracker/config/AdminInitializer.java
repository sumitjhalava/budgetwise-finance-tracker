package com.app.financeTracker.config;

import com.app.financeTracker.enums.Role;
import com.app.financeTracker.model.User;
import com.app.financeTracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@budget.com")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@budget.com")
                    .password(passwordEncoder.encode("admin$123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("ADMIN created: admin@budget.com / admin$123");
        }
    }
}
