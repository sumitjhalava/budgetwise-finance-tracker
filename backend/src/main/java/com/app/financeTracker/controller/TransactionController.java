package com.app.financeTracker.controller;

import com.app.financeTracker.common.ApiResponse;
import com.app.financeTracker.dto.TransactionRequestDto;
import com.app.financeTracker.dto.TransactionResponseDto;
import com.app.financeTracker.service.TransactionService;
import com.app.financeTracker.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private static final Logger log = LogManager.getLogger(TransactionController.class);
    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponseDto>> createTransaction(
            @Valid @RequestBody TransactionRequestDto request,
            Authentication auth) {

        log.info("POST /api/transactions called by user: {}", auth.getName());
        TransactionResponseDto res = transactionService.createTransaction(request, auth.getName());
        return ResponseUtil.success("Transaction created successfully", res);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionResponseDto>>> getUserTransactions(
            Authentication auth) {

        log.info("GET /api/transactions called by user: {}", auth.getName());
        List<TransactionResponseDto> res = transactionService.getUserTransactions(auth.getName());
        return ResponseUtil.success("Transactions fetched successfully", res);
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTransactionSummary(
            Authentication auth) {

        log.info("GET /api/transactions/summary called by user: {}", auth.getName());
        Map<String, Object> summary = transactionService.getTransactionSummary(auth.getName());
        return ResponseUtil.success("Transaction summary fetched successfully", summary);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteTransaction(
            @PathVariable Long id, Authentication auth) {

        log.info("DELETE /api/transactions/{} called by user: {}", id, auth.getName());
        transactionService.deleteTransaction(id, auth.getName());
        return ResponseUtil.success("Transaction deleted successfully", null);
    }
}
