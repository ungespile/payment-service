package com.payment.repository;

import com.payment.entity.PaymentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRequestRepository extends JpaRepository<PaymentRequest, Long> {
    
    List<PaymentRequest> findByOperatorId(Long operatorId);

    @Query("SELECT pr FROM PaymentRequest pr WHERE " +
           "(:operatorId IS NULL OR pr.operatorId = :operatorId) AND " +
           "(:startDate IS NULL OR pr.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR pr.createdAt <= :endDate) AND " +
           "pr.isApproved = true " +
           "ORDER BY pr.approvedAt DESC")
    List<PaymentRequest> findApprovedByFilters(
            @Param("operatorId") Long operatorId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
