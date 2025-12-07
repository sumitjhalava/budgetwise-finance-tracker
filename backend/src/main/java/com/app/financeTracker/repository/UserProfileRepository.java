package com.app.financeTracker.repository;

import com.app.financeTracker.model.User;
import com.app.financeTracker.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUser(User user);
    void deleteByUser(User user);
}
