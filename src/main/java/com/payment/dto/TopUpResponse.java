package com.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopUpResponse {

    private boolean success;
    private String message;
    private Long paymentRequestId;
    private Long accountId;
    private BigDecimal amount;

    public TopUpResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
