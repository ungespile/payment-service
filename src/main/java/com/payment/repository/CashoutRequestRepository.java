package com.payment.repository;

import com.payment.entity.CashoutRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CashoutRequestRepository extends JpaRepository<CashoutRequest, Long> {
    
    List<CashoutRequest> findByOperatorId(Long operatorId);
}
