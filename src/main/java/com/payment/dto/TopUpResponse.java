package com.payment.dto;

import java.math.BigDecimal;

public class TopUpResponse {

    private boolean success;
    private String message;
    private Long paymentRequestId;
    private Long accountId;
    private BigDecimal amount;

    public TopUpResponse() {
    }

    public TopUpResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public TopUpResponse(boolean success, String message, Long paymentRequestId, Long accountId, BigDecimal amount) {
        this.success = success;
        this.message = message;
        this.paymentRequestId = paymentRequestId;
        this.accountId = accountId;
        this.amount = amount;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getPaymentRequestId() {
        return paymentRequestId;
    }

    public void setPaymentRequestId(Long paymentRequestId) {
        this.paymentRequestId = paymentRequestId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
