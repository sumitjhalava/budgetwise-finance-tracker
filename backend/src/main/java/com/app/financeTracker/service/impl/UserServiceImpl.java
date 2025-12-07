package com.app.financeTracker.service.impl;

import com.app.financeTracker.dto.RegisterRequestDto;
import com.app.financeTracker.dto.RegisterResponseDto;
import com.app.financeTracker.enums.Role;
import com.app.financeTracker.exception.ResourceNotFoundException;
import com.app.financeTracker.model.User;
import com.app.financeTracker.model.UserProfile;
import com.app.financeTracker.repository.UserProfileRepository;
import com.app.financeTracker.repository.UserRepository;
import com.app.financeTracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private RegisterResponseDto toDto(User user){
        return new RegisterResponseDto(user.getId(),user.getUsername(),user.getEmail());
    }

    private User toEntity(RegisterRequestDto requestDto){
        User user = new User();
        user.setUsername(requestDto.getUsername());
        user.setEmail(requestDto.getEmail());
        user.setPassword(passwordEncoder.encode(requestDto.getPassword()));
        user.setRole(Role.USER);
        return user;
    }

    @Override
    public RegisterResponseDto createUser(RegisterRequestDto requestDto) {
        if (userRepository.existsByUsername(requestDto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User savedUser = userRepository.save(toEntity(requestDto));

        UserProfile profile = UserProfile.builder()
                .user(savedUser)
                .monthlyIncome(0.0)
                .savingTarget(0.0)
                .financialGoal("Not Set")
                .currency("INR")
                .build();

        userProfileRepository.save(profile);

        return toDto(savedUser);
    }

    @Override
    public RegisterResponseDto getUserById(Long id) {
        User user = userRepository.findById(id.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toDto(user);
    }

    @Override
    public List<RegisterResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

}
