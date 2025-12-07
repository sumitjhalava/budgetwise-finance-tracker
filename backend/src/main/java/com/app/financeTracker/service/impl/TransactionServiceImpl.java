package com.app.financeTracker.service.impl;

import com.app.financeTracker.dto.TransactionRequestDto;
import com.app.financeTracker.dto.TransactionResponseDto;
import com.app.financeTracker.exception.ResourceNotFoundException;
import com.app.financeTracker.model.Transaction;
import com.app.financeTracker.model.User;
import com.app.financeTracker.repository.TransactionRepository;
import com.app.financeTracker.repository.UserRepository;
import com.app.financeTracker.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private static final Logger log = LogManager.getLogger(TransactionServiceImpl.class);

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TransactionResponseDto createTransaction(TransactionRequestDto request, String username) {
        log.info("Creating transaction for username: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Transaction transaction = new Transaction();
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setDate(request.getDate());
        transaction.setUser(user);

        Transaction saved = transactionRepository.save(transaction);
        log.info("Transaction created successfully. ID: {}, user: {}", saved.getId(), username);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponseDto> getUserTransactions(String username) {
        log.info("Fetching transactions for username: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Transaction> transactions = transactionRepository.findByUserOrderByCreatedAtDesc(user);
        List<TransactionResponseDto> response = transactions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        log.info("Found {} transactions for user: {}", response.size(), username);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getTransactionSummary(String username) {
        log.info("Generating transaction summary for username: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Double totalIncome = transactionRepository.sumAmountByUserAndType(user, "income");
        Double totalExpenses = transactionRepository.sumAmountByUserAndType(user, "expense");

        totalIncome = totalIncome != null ? totalIncome : 0.0;
        totalExpenses = totalExpenses != null ? totalExpenses : 0.0;

        List<Object[]> expensesByCategory = transactionRepository.getExpensesByCategory(user);
        Map<String, Double> categoryMap = new HashMap<>();
        for (Object[] row : expensesByCategory) {
            // defensive casts
            String cat = row[0] != null ? row[0].toString() : "Unknown";
            Double amt = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            categoryMap.put(cat, amt);
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("balance", totalIncome - totalExpenses);
        summary.put("expensesByCategory", categoryMap);

        log.info("Transaction summary generated for user: {}", username);
        return summary;
    }

    @Override
    @Transactional
    public void deleteTransaction(Long id, String username) {
        log.info("Deleting transaction id: {} requested by user: {}", id, username);

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
            log.warn("User {} attempted to delete transaction {} which belongs to user {}", username, id, transaction.getUser().getEmail());
            throw new RuntimeException("Forbidden");
        }

        transactionRepository.delete(transaction);
        log.info("Transaction id: {} deleted by user: {}", id, username);
    }

    // helper mapping method
    private TransactionResponseDto mapToResponse(Transaction transaction) {
        TransactionResponseDto response = new TransactionResponseDto();
        response.setId(transaction.getId());
        response.setDescription(transaction.getDescription());
        response.setAmount(transaction.getAmount());
        response.setType(transaction.getType());
        response.setCategory(transaction.getCategory());
        response.setDate(transaction.getDate());
        response.setCreatedAt(transaction.getCreatedAt());
        return response;
    }
}
