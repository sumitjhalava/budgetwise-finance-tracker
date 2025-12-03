package com.budgetwise.repository;

import com.budgetwise.model.Transaction;
import com.budgetwise.model.User;
import org.springframework.data.domain.Pageable;
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
    
    @Query("SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), " +
           "SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), " +
           "AVG(CASE WHEN t.type = 'expense' THEN t.amount ELSE NULL END) " +
           "FROM Transaction t WHERE t.user = :user " +
           "AND EXTRACT(YEAR FROM t.date) = :year AND EXTRACT(MONTH FROM t.date) = :month")
    Object[] getMonthlySummary(@Param("user") User user, @Param("year") int year, @Param("month") int month);
    
    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND t.type = 'expense' " +
           "AND EXTRACT(YEAR FROM t.date) = :year AND EXTRACT(MONTH FROM t.date) = :month " +
           "ORDER BY t.amount DESC")
    List<Transaction> getLargestExpenseForMonth(@Param("user") User user, @Param("year") int year, @Param("month") int month, Pageable pageable);
    
    List<Transaction> findByUserAndDateBetweenOrderByCreatedAtDesc(User user, LocalDate startDate, LocalDate endDate);
}