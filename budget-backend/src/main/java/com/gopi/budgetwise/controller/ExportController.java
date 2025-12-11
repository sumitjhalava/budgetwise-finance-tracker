package com.gopi.budgetwise.controller;

import com.gopi.budgetwise.entity.Transaction;
import com.gopi.budgetwise.entity.User;
import com.gopi.budgetwise.repository.TransactionRepository;
import com.gopi.budgetwise.repository.UserRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "http://localhost:3000")
public class ExportController {

    private final TransactionRepository txRepo;
    private final UserRepository userRepo;

    public ExportController(TransactionRepository t, UserRepository u) {
        this.txRepo = t;
        this.userRepo = u;
    }

    @GetMapping("/transactions/csv/{userId}")
    public ResponseEntity<byte[]> exportCsv(@PathVariable Long userId) {
        User u = userRepo.findById(userId).orElse(null);
        if (u == null) return ResponseEntity.badRequest().build();

        List<Transaction> txs = txRepo.findByUser(u);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        String header = "Type,Amount,Category,Description,Date\n";
        try {
            out.write(header.getBytes(StandardCharsets.UTF_8));
            DateTimeFormatter fmt = DateTimeFormatter.ISO_DATE;
            for (Transaction t : txs) {
                String line = String.format("%s,%.2f,%s,%s,%s\n",
                        t.type,
                        t.amount,
                        t.category,
                        t.description == null ? "" : t.description.replace(",", " "),
                        t.date.format(fmt));
                out.write(line.getBytes(StandardCharsets.UTF_8));
            }
        } catch (Exception e) { }

        byte[] data = out.toByteArray();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv");

        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }
}
