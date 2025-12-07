package com.app.financeTracker.controller;

import com.app.financeTracker.common.ApiResponse;
import com.app.financeTracker.dto.RegisterResponseDto;
import com.app.financeTracker.service.UserService;
import com.app.financeTracker.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;
    private static final Logger log = LogManager.getLogger(AdminProfileController.class);

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<RegisterResponseDto>>> getAllUsers() {
        log.info("ADMIN fetching all users");
        List<RegisterResponseDto> users = userService.getAllUsers();
        return ResponseUtil.success("Users fetched successfully", users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RegisterResponseDto>> getUserById(@PathVariable Long id) {
        log.info("ADMIN fetching user by id: {}", id);
        RegisterResponseDto user = userService.getUserById(id);
        return ResponseUtil.success("User fetched successfully", user);
    }
}
