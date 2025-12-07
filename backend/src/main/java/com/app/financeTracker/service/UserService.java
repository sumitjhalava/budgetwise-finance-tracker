package com.app.financeTracker.service;

import com.app.financeTracker.dto.RegisterRequestDto;
import com.app.financeTracker.dto.RegisterResponseDto;

import java.util.List;

public interface UserService {

    RegisterResponseDto createUser(RegisterRequestDto requestDto);

    RegisterResponseDto getUserById(Long id);

    List<RegisterResponseDto> getAllUsers();

}
