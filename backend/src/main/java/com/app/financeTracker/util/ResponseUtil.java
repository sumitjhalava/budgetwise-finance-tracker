package com.app.financeTracker.util;

import com.app.financeTracker.common.ApiResponse;
import com.app.financeTracker.enums.ResponseStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseUtil {

    public static <T> ResponseEntity<ApiResponse<T>> success(String message, T data) {
        ApiResponse<T> body = new ApiResponse<>(ResponseStatus.SUCCESS,message,data);
        return ResponseEntity.ok(body);
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(String message, T data) {
        ApiResponse<T> body = new ApiResponse<>(ResponseStatus.SUCCESS, message, data);
        return new ResponseEntity<>(body,HttpStatus.CREATED);
    }

    public static <T> ResponseEntity<ApiResponse<T>> failure(String message, HttpStatus status){
        ApiResponse<T> body = new ApiResponse<>(ResponseStatus.FAILED, message, null);
        return new ResponseEntity<>(body,status);
    }

    public static <T> ResponseEntity<ApiResponse<T>> error(String message) {
        ApiResponse<T> body = new ApiResponse<>(ResponseStatus.ERROR, message,null);
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
