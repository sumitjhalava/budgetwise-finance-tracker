package com.app.financeTracker.service;

import com.app.financeTracker.dto.UserProfileRequestDto;
import com.app.financeTracker.dto.UserProfileResponseDto;

public interface ProfileService {

    UserProfileResponseDto getProfile(String username);

    UserProfileResponseDto updateProfile(String username, UserProfileRequestDto dto);

    void deleteProfile(String username);
}
