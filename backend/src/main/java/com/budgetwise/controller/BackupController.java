package com.budgetwise.controller;

import com.budgetwise.model.Transaction;
import com.budgetwise.model.User;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/backup")
public class BackupController {

    private static final Logger logger = LoggerFactory.getLogger(BackupController.class);

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public BackupController(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> backupToProvider(@RequestBody Map<String, String> body, Authentication auth) {
        String provider = body.getOrDefault("provider", "").toLowerCase();
        Map<String, Object> resp = new HashMap<>();

        if (!provider.equals("gdrive") && !provider.equals("dropbox")) {
            resp.put("status", "error");
            resp.put("message", "Unsupported provider. Use 'gdrive' or 'dropbox'.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        try {
            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Transaction> transactions = transactionRepository.findByUserOrderByCreatedAtDesc(user);

            // Create CSV payload (simulate upload)
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

            byte[] payload = out.toByteArray();

            // If client provided an access token, attempt direct upload.
            String token = body.getOrDefault("token", "");
            if (provider.equals("dropbox") && token != null && !token.isBlank()) {
                Map<String, Object> up = uploadToDropbox(payload, token);
                return ResponseEntity.status((int) up.getOrDefault("httpStatus", 200)).body(up);
            }

            if (provider.equals("gdrive") && token != null && !token.isBlank()) {
                Map<String, Object> up = uploadToGoogleDrive(payload, token);
                return ResponseEntity.status((int) up.getOrDefault("httpStatus", 200)).body(up);
            }

            // No token provided — return simulated metadata and instructions.
            resp.put("status", "success");
            resp.put("provider", provider);
            resp.put("sizeBytes", payload.length);
            resp.put("fileName", "budgetwise-backup.csv");
            resp.put("message", "Backup created locally. Provide a provider access token to upload directly (send 'token' in POST body).");
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            logger.error("Backup failed: {}", e.getMessage(), e);
            resp.put("status", "error");
            resp.put("message", "Backup failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resp);
        }
    }

    private Map<String, Object> uploadToDropbox(byte[] data, String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://content.dropboxapi.com/2/files/upload"))
                    .header("Authorization", "Bearer " + token)
                    .header("Dropbox-API-Arg", "{\"path\": \"/budgetwise-backup.csv\", \"mode\": \"overwrite\"}")
                    .header("Content-Type", "application/octet-stream")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(data))
                    .build();

            HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
            result.put("httpStatus", resp.statusCode());
            result.put("responseBody", resp.body());
            if (resp.statusCode() >= 200 && resp.statusCode() < 300) {
                result.put("status", "success");
                result.put("message", "Uploaded to Dropbox");
            } else {
                result.put("status", "error");
                result.put("message", "Dropbox upload failed");
            }
            return result;
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Dropbox upload exception: " + e.getMessage());
            result.put("httpStatus", 500);
            return result;
        }
    }

    private Map<String, Object> uploadToGoogleDrive(byte[] data, String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            // Build multipart/related body for Drive upload
            String boundary = "----BudgetwiseBoundary" + System.currentTimeMillis();
            String metadata = "{\"name\": \"budgetwise-backup.csv\"}";

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            String nl = "\r\n";
            String part1 = "--" + boundary + nl +
                    "Content-Type: application/json; charset=UTF-8" + nl + nl +
                    metadata + nl;
            bos.write(part1.getBytes(StandardCharsets.UTF_8));

            String part2Header = "--" + boundary + nl +
                    "Content-Type: text/csv" + nl + nl;
            bos.write(part2Header.getBytes(StandardCharsets.UTF_8));
            bos.write(data);
            bos.write(nl.getBytes(StandardCharsets.UTF_8));
            String end = "--" + boundary + "--" + nl;
            bos.write(end.getBytes(StandardCharsets.UTF_8));

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"))
                    .header("Authorization", "Bearer " + token)
                    .header("Content-Type", "multipart/related; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(bos.toByteArray()))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
            result.put("httpStatus", resp.statusCode());
            result.put("responseBody", resp.body());
            if (resp.statusCode() >= 200 && resp.statusCode() < 300) {
                result.put("status", "success");
                result.put("message", "Uploaded to Google Drive");
            } else {
                result.put("status", "error");
                result.put("message", "Google Drive upload failed");
            }
            return result;
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Google Drive upload exception: " + e.getMessage());
            result.put("httpStatus", 500);
            return result;
        }
    }
}
