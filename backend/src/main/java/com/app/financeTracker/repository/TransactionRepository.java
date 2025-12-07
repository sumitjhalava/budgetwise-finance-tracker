package com.app.financeTracker.repository;

import com.app.financeTracker.model.Transaction;
import com.app.financeTracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByUserOrderByCreatedAtDesc(User user);
    
    List<Transaction> findByUserAndTypeOrderByCreatedAtDesc(User user, String type);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    Double sumAmountByUserAndType(@Param("user") User user, @Param("type") String type);
    
    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = 'expense' GROUP BY t.category")
    List<Object[]> getExpensesByCategory(@Param("user") User user);
    
    List<Transaction> findByUserAndDateBetweenOrderByCreatedAtDesc(User user, LocalDate startDate, LocalDate endDate);
}