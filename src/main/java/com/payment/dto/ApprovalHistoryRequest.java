package com.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalHistoryRequest {

    private Long operatorId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
