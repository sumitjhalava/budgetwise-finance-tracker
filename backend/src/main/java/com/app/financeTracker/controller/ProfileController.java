package com.app.financeTracker.controller;

import com.app.financeTracker.common.ApiResponse;
import com.app.financeTracker.dto.UserProfileRequestDto;
import com.app.financeTracker.dto.UserProfileResponseDto;
import com.app.financeTracker.service.ProfileService;
import com.app.financeTracker.util.ResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private static final Logger log = LogManager.getLogger(ProfileController.class);

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> getProfile(Authentication authentication) {
        String username = authentication.getName();
        log.info("GET /api/profile called by username: {}", username);

        UserProfileResponseDto dto = profileService.getProfile(username);
        return ResponseUtil.success("Profile fetched successfully", dto);
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> updateProfile(
            @Valid @RequestBody UserProfileRequestDto dto,
            Authentication authentication) {

        String username = authentication.getName();
        log.info("PUT /api/profile called by username: {}", username);

        UserProfileResponseDto responseDto = profileService.updateProfile(username, dto);
        return ResponseUtil.success("Profile updated successfully", responseDto);
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Object>> deleteProfile(Authentication authentication) {
        String username = authentication.getName();
        log.info("DELETE /api/profile called by username: {}", username);

        profileService.deleteProfile(username);
        return ResponseUtil.success("Profile deleted successfully", null);
    }

}


