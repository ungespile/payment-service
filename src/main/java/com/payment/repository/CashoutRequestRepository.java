package com.payment.repository;

import com.payment.entity.CashoutRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CashoutRequestRepository extends JpaRepository<CashoutRequest, Long> {
}
