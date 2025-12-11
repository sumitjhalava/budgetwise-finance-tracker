package com.gopi.budgetwise.controller;

import com.gopi.budgetwise.dto.TransactionRequest;
import com.gopi.budgetwise.entity.Transaction;
import com.gopi.budgetwise.entity.User;
import com.gopi.budgetwise.repository.TransactionRepository;
import com.gopi.budgetwise.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionController(TransactionRepository tr, UserRepository ur) {
        this.transactionRepository = tr;
        this.userRepository = ur;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody TransactionRequest req) {
        User u = userRepository.findById(req.userId).orElse(null);
        if (u == null) return ResponseEntity.badRequest().body("User not found");

        Transaction t = new Transaction();
        t.user = u;
        t.type = req.type;
        t.amount = req.amount;
        t.category = req.category;
        t.description = req.description;
        t.date = (req.date != null ? req.date : LocalDate.now());

        transactionRepository.save(t);
        return ResponseEntity.ok(t);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getForUser(@PathVariable Long userId) {
        User u = userRepository.findById(userId).orElse(null);
        if (u == null) return ResponseEntity.badRequest().body("User not found");

        List<Transaction> list = transactionRepository.findByUser(u);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!transactionRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Transaction not found");
        }
        transactionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
