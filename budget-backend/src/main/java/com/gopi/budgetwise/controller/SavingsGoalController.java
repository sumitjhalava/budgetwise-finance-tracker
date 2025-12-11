package com.gopi.budgetwise.controller;

import com.gopi.budgetwise.dto.SavingsGoalRequest;
import com.gopi.budgetwise.entity.SavingsGoal;
import com.gopi.budgetwise.entity.User;
import com.gopi.budgetwise.repository.SavingsGoalRepository;
import com.gopi.budgetwise.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:3000")
public class SavingsGoalController {

    private final SavingsGoalRepository repo;
    private final UserRepository userRepo;

    public SavingsGoalController(SavingsGoalRepository r, UserRepository ur) {
        this.repo = r;
        this.userRepo = ur;
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdate(@RequestBody SavingsGoalRequest req) {
        User u = userRepo.findById(req.userId).orElse(null);
        if (u == null) return ResponseEntity.badRequest().body("User not found");

        SavingsGoal g = new SavingsGoal();
        g.user = u;
        g.name = req.name;
        g.targetAmount = req.targetAmount;
        g.currentAmount = (req.currentAmount != null ? req.currentAmount : 0.0);
        g.deadline = req.deadline;

        repo.save(g);
        return ResponseEntity.ok(g);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> list(@PathVariable Long userId) {
        User u = userRepo.findById(userId).orElse(null);
        if (u == null) return ResponseEntity.badRequest().body("User not found");

        List<SavingsGoal> list = repo.findByUser(u);
        return ResponseEntity.ok(list);
    }
}
