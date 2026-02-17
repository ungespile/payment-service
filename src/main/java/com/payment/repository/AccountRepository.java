package com.payment.repository;

import com.payment.entity.Account;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    
    @Query("SELECT a FROM Account a WHERE a.isActive = true AND a.uncheckedAvailableAmount < :amount ORDER BY a.id ASC")
    List<Account> findActiveAccountsWithUncheckedAmountLessThan(@Param("amount") BigDecimal amount, Pageable pageable);
}
