package com.budgetwise.controller;

import com.budgetwise.dto.MonthlySummaryDto;
import com.budgetwise.dto.TransactionRequest;
import com.budgetwise.dto.TransactionResponse;
import com.budgetwise.model.Transaction;
import com.budgetwise.model.User;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.service.AutoCategoryService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.nio.charset.StandardCharsets;
import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AutoCategoryService autoCategoryService;

    public TransactionController(TransactionRepository transactionRepository, UserRepository userRepository, AutoCategoryService autoCategoryService) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.autoCategoryService = autoCategoryService;
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportTransactions(@RequestParam(defaultValue = "csv") String format, Authentication auth) {
        try {
            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            List<Transaction> transactions = transactionRepository.findByUserOrderByCreatedAtDesc(user);

            if ("csv".equalsIgnoreCase(format)) {
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                PrintWriter writer = new PrintWriter(new OutputStreamWriter(out, StandardCharsets.UTF_8));
                writer.println("Description,Amount,Type,Category,Date,CreatedAt");
                for (Transaction t : transactions) {
                    writer.printf("\"%s\",%s,%s,\"%s\",%s,%s\n",
                        t.getDescription().replaceAll("\"", "'"),
                        t.getAmount(),
                        t.getType(),
                        t.getCategory().replaceAll("\"", "'"),
                        t.getDate() != null ? t.getDate().toString() : "",
                        t.getCreatedAt() != null ? t.getCreatedAt().toString() : ""
                    );
                }
                writer.flush();
                byte[] csvBytes = out.toByteArray();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType("text/csv"));
                headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv");
                return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
            } else if ("pdf".equalsIgnoreCase(format)) {
                // Simple PDF export using plain text (for demo; use iText or Apache PDFBox for real PDF)
                StringBuilder sb = new StringBuilder();
                sb.append("Transactions\n\n");
                sb.append("Description | Amount | Type | Category | Date | CreatedAt\n");
                for (Transaction t : transactions) {
                    sb.append(String.format("%s | %s | %s | %s | %s | %s\n",
                        t.getDescription(),
                        t.getAmount(),
                        t.getType(),
                        t.getCategory(),
                        t.getDate() != null ? t.getDate().toString() : "",
                        t.getCreatedAt() != null ? t.getCreatedAt().toString() : ""
                    ));
                }
                byte[] pdfBytes = sb.toString().getBytes(StandardCharsets.UTF_8);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.pdf");
                return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.badRequest().body(null);
            }
        } catch (Exception e) {
            logger.error("Failed to export transactions: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request, Authentication auth) {
        try {
            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Transaction transaction = new Transaction();
            transaction.setDescription(request.getDescription());
            transaction.setAmount(request.getAmount());
            transaction.setType(request.getType());
            transaction.setDate(request.getDate());
            transaction.setUser(user);

            // Auto-categorization logic
            String predictedCategory = autoCategoryService.predictCategory(request.getDescription());
            
            transaction.setPredictedCategory(predictedCategory);
            
            // Use predicted category if no category provided, otherwise use manual category
            if (request.getCategory() == null || request.getCategory().trim().isEmpty() || request.getCategory().equals(predictedCategory)) {
                transaction.setCategory(predictedCategory);
                transaction.setCategorySource("auto");
            } else {
                transaction.setCategory(request.getCategory());
                transaction.setCategorySource("manual");
            }

            Transaction saved = transactionRepository.save(transaction);
            return ResponseEntity.ok(mapToResponse(saved));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid transaction data: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        } catch (DataAccessException e) {
            logger.error("Database error creating transaction: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            logger.error("Failed to create transaction: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getUserTransactions(Authentication auth) {
        try {
            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Transaction> transactions = transactionRepository.findByUserOrderByCreatedAtDesc(user);
            List<TransactionResponse> response = transactions.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Failed to fetch transactions: {}", e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getTransactionSummary(Authentication auth) {
        try {
            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Double totalIncome = transactionRepository.sumAmountByUserAndType(user, "income");
            Double totalExpenses = transactionRepository.sumAmountByUserAndType(user, "expense");
            
            totalIncome = totalIncome != null ? totalIncome : 0.0;
            totalExpenses = totalExpenses != null ? totalExpenses : 0.0;

            List<Object[]> expensesByCategory = transactionRepository.getExpensesByCategory(user);
            Map<String, Double> categoryMap = new HashMap<>();
            for (Object[] row : expensesByCategory) {
                categoryMap.put((String) row[0], (Double) row[1]);
            }

            Map<String, Object> summary = new HashMap<>();
            summary.put("totalIncome", totalIncome);
            summary.put("totalExpenses", totalExpenses);
            summary.put("balance", totalIncome - totalExpenses);
            summary.put("expensesByCategory", categoryMap);

            return ResponseEntity.ok(summary);
        } catch (DataAccessException e) {
            logger.error("Database error generating transaction summary: {}", e.getMessage(), e);
            Map<String, Object> emptySummary = new HashMap<>();
            emptySummary.put("totalIncome", 0.0);
            emptySummary.put("totalExpenses", 0.0);
            emptySummary.put("balance", 0.0);
            emptySummary.put("expensesByCategory", new HashMap<>());
            return ResponseEntity.ok(emptySummary);
        } catch (RuntimeException e) {
            logger.error("Failed to generate transaction summary: {}", e.getMessage(), e);
            Map<String, Object> emptySummary = new HashMap<>();
            emptySummary.put("totalIncome", 0.0);
            emptySummary.put("totalExpenses", 0.0);
            emptySummary.put("balance", 0.0);
            emptySummary.put("expensesByCategory", new HashMap<>());
            return ResponseEntity.ok(emptySummary);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request,
            Authentication auth) {
        try {
            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Transaction transaction = transactionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Transaction not found"));

            if (!transaction.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }

            transaction.setDescription(request.getDescription());
            transaction.setAmount(request.getAmount());
            transaction.setType(request.getType());
            transaction.setCategory(request.getCategory());
            transaction.setDate(request.getDate());

            Transaction updated = transactionRepository.save(transaction);
            return ResponseEntity.ok(mapToResponse(updated));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid transaction data: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        } catch (DataAccessException e) {
            logger.error("Database error updating transaction: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            logger.error("Failed to update transaction: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, Authentication auth) {
        try {
            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Transaction transaction = transactionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Transaction not found"));

            if (!transaction.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }

            transactionRepository.delete(transaction);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            logger.error("Database error deleting transaction: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            logger.error("Failed to delete transaction: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<MonthlySummaryDto> getMonthlySummary(
            @RequestParam int year,
            @RequestParam int month,
            Authentication auth) {
        try {
            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Object[] summaryData = transactionRepository.getMonthlySummary(user, year, month);
            
            Double totalIncome = summaryData[0] != null ? (Double) summaryData[0] : 0.0;
            Double totalExpenses = summaryData[1] != null ? (Double) summaryData[1] : 0.0;
            Double avgExpense = summaryData[2] != null ? (Double) summaryData[2] : 0.0;
            
            // Calculate days in month for daily average
            LocalDate monthStart = LocalDate.of(year, month, 1);
            int daysInMonth = monthStart.lengthOfMonth();
            Double avgDailyExpense = totalExpenses / daysInMonth;
            
            // Get largest expense
            List<Transaction> largestExpenses = transactionRepository.getLargestExpenseForMonth(
                user, year, month, PageRequest.of(0, 1));
            
            MonthlySummaryDto.LargestExpenseDto largestExpense = null;
            if (!largestExpenses.isEmpty()) {
                Transaction largest = largestExpenses.get(0);
                largestExpense = new MonthlySummaryDto.LargestExpenseDto();
                largestExpense.setId(largest.getId());
                largestExpense.setDescription(largest.getDescription());
                largestExpense.setAmount(largest.getAmount());
                largestExpense.setDate(largest.getDate() != null ? largest.getDate().toString() : 
                    largest.getCreatedAt().toLocalDate().toString());
            }
            
            MonthlySummaryDto summary = new MonthlySummaryDto();
            summary.setYear(year);
            summary.setMonth(month);
            summary.setTotalIncome(totalIncome);
            summary.setTotalExpenses(totalExpenses);
            summary.setBalance(totalIncome - totalExpenses);
            summary.setAvgDailyExpense(avgDailyExpense);
            summary.setLargestExpense(largestExpense);
            
            return ResponseEntity.ok(summary);
        } catch (ClassCastException e) {
            logger.error("Data type conversion error in monthly summary: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            logger.error("Failed to generate monthly summary: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/predict-category")
    public ResponseEntity<Map<String, Object>> predictCategory(@RequestBody Map<String, String> request) {
        try {
            String description = request.get("description");
            String predictedCategory = autoCategoryService.predictCategory(description);
            
            Map<String, Object> response = new HashMap<>();
            response.put("predictedCategory", predictedCategory);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input for category prediction: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            logger.error("Failed to predict category: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        if (transaction == null) {
            throw new IllegalArgumentException("Transaction cannot be null");
        }
        
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setDescription(transaction.getDescription());
        response.setAmount(transaction.getAmount());
        response.setType(transaction.getType());
        response.setCategory(transaction.getCategory());
        response.setPredictedCategory(transaction.getPredictedCategory());
        response.setCategorySource(transaction.getCategorySource());

        response.setDate(transaction.getDate());
        response.setCreatedAt(transaction.getCreatedAt());
        return response;
    }
}