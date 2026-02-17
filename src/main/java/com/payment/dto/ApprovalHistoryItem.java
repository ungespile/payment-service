package com.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalHistoryItem {

    private Long id;
    private String type; // "PAYMENT" or "CASHOUT"
    private Long operatorId;
    private Long accountId;
    private BigDecimal amount;
    private Boolean isApproved;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
}
