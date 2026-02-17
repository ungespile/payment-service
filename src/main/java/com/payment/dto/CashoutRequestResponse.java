package com.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CashoutRequestResponse {

    private Long id;
    private Long operatorId;
    private Long accountId;
    private BigDecimal amount;
    private Boolean isApproved;
}
