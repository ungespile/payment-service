package com.payment.repository;

import com.payment.entity.PaymentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRequestRepository extends JpaRepository<PaymentRequest, Long> {
    
    List<PaymentRequest> findByOperatorId(Long operatorId);
}
