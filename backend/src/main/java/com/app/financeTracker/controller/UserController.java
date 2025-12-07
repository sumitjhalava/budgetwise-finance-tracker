package com.app.financeTracker.controller;

import com.app.financeTracker.common.ApiResponse;
import com.app.financeTracker.dto.AuthRequest;
import com.app.financeTracker.dto.AuthResponse;
import com.app.financeTracker.dto.RegisterRequestDto;
import com.app.financeTracker.dto.RegisterResponseDto;
import com.app.financeTracker.service.UserService;
import com.app.financeTracker.util.JwtUtil;
import com.app.financeTracker.util.ResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

    private static final Logger log = LogManager.getLogger(UserController.class);

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponseDto>> createUser(@Valid @RequestBody RegisterRequestDto requestDto){

        log.info("Received request to create user with email {}", requestDto.getEmail());
        log.debug("User request payload : "+requestDto.getEmail()+" : "+ requestDto.getUsername());
        RegisterResponseDto responseDto = userService.createUser(requestDto);
        return ResponseUtil.created("User created successfully",responseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest request){
        log.info("Login method called : ",getClass());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
         String token = jwtUtil.generateToken(request.getUsername());
         return ResponseUtil.created("token generated successfully",new AuthResponse(token));
    }
}
