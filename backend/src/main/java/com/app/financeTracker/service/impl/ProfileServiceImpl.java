package com.app.financeTracker.service.impl;

import com.app.financeTracker.dto.UserProfileRequestDto;
import com.app.financeTracker.dto.UserProfileResponseDto;
import com.app.financeTracker.exception.ResourceNotFoundException;
import com.app.financeTracker.model.User;
import com.app.financeTracker.model.UserProfile;
import com.app.financeTracker.repository.UserProfileRepository;
import com.app.financeTracker.repository.UserRepository;
import com.app.financeTracker.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private static final Logger log = LogManager.getLogger(ProfileServiceImpl.class);

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;

    @Override
    public UserProfileResponseDto getProfile(String username) {
        log.info("Fetching profile for username: {}", username);


        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + username));

        return toResponseDto(profile);
    }

    @Override
    public UserProfileResponseDto updateProfile(String username, UserProfileRequestDto dto) {
        log.info("Updating profile for username: {}", username);


        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() ->
                new ResourceNotFoundException("Profile not found for user: " + username)
        );

        if (dto.getMonthlyIncome() != null) profile.setMonthlyIncome(dto.getMonthlyIncome());
        if (dto.getSavingTarget() != null) profile.setSavingTarget(dto.getSavingTarget());
        if (dto.getFinancialGoal() != null) profile.setFinancialGoal(dto.getFinancialGoal());
        if (dto.getCurrency() != null) profile.setCurrency(dto.getCurrency());

        UserProfile saved = profileRepository.save(profile);
        log.debug("Profile updated for username: {}, profileId: {}", username, saved.getId());

        return toResponseDto(saved);
    }

    @Override
    public void deleteProfile(String username) {
        log.info("Deleting profile for username: {}", username);


        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        user.setProfile(null);
        userRepository.save(user);
        profileRepository.delete(profile);
    }

    private UserProfileResponseDto toResponseDto(UserProfile profile) {
        return UserProfileResponseDto.builder()
                .monthlyIncome(profile.getMonthlyIncome())
                .savingTarget(profile.getSavingTarget())
                .financialGoal(profile.getFinancialGoal())
                .currency(profile.getCurrency())
                .build();
    }
}
