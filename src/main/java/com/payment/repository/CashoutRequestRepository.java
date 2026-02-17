package com.payment.repository;

import com.payment.entity.CashoutRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CashoutRequestRepository extends JpaRepository<CashoutRequest, Long> {
    
    List<CashoutRequest> findByOperatorId(Long operatorId);

    @Query("SELECT cr FROM CashoutRequest cr WHERE " +
           "(:operatorId IS NULL OR cr.operatorId = :operatorId) AND " +
           "(:startDate IS NULL OR cr.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR cr.createdAt <= :endDate) AND " +
           "cr.isApproved = true " +
           "ORDER BY cr.approvedAt DESC")
    List<CashoutRequest> findApprovedByFilters(
            @Param("operatorId") Long operatorId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
