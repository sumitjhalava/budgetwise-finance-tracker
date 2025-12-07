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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/profile")
@RequiredArgsConstructor
public class AdminProfileController {

    private final ProfileService profileService;
    private static final Logger log = LogManager.getLogger(AdminProfileController.class);

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> getAnyProfile(@PathVariable String username) {
        log.info("ADMIN fetching profile for username: {}", username);
        return ResponseUtil.success("Profile fetched successfully", profileService.getProfile(username));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{username}")
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> updateAnyProfile(@PathVariable String username,
                                                                                @Valid @RequestBody UserProfileRequestDto dto) {
        log.info("ADMIN updating profile for username: {}", username);
        return ResponseUtil.success("Profile updated successfully", profileService.updateProfile(username, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{username}")
    public ResponseEntity<ApiResponse<Object>> deleteAnyProfile(@PathVariable String username) {
        log.info("ADMIN deleting profile for username: {}", username);
        profileService.deleteProfile(username);
        return ResponseUtil.success("Profile deleted successfully", null);
    }
}
