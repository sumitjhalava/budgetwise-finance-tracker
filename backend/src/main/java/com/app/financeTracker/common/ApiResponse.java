package com.app.financeTracker.common;


import com.app.financeTracker.enums.ResponseStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {

    private ResponseStatus status;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public ApiResponse(ResponseStatus status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }
}