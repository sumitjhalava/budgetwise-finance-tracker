package com.app.financeTracker.service;

import com.app.financeTracker.dto.TransactionRequestDto;
import com.app.financeTracker.dto.TransactionResponseDto;

import java.util.List;
import java.util.Map;

public interface TransactionService {

    TransactionResponseDto createTransaction(TransactionRequestDto request, String username);

    List<TransactionResponseDto> getUserTransactions(String username);

    Map<String, Object> getTransactionSummary(String username);

    void deleteTransaction(Long id, String username);
}
