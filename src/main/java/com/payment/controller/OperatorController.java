package com.payment.controller;

import com.payment.dto.CashoutRequestResponse;
import com.payment.dto.PaymentRequestResponse;
import com.payment.entity.CashoutRequest;
import com.payment.entity.PaymentRequest;
import com.payment.service.AccountService;
import com.payment.service.CashoutService;
import com.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/operator")
@RequiredArgsConstructor
public class OperatorController {

    private final PaymentService paymentService;
    private final CashoutService cashoutService;
    private final AccountService accountService;

    @GetMapping("/{operatorId}/payment-requests")
    public ResponseEntity<List<PaymentRequestResponse>> getPaymentRequestsByOperatorId(
            @PathVariable Long operatorId) {
        
        List<PaymentRequest> paymentRequests = paymentService.getPaymentRequestsByOperatorId(operatorId);
        
        List<PaymentRequestResponse> responses = paymentRequests.stream()
                .map(pr -> new PaymentRequestResponse(
                        pr.getId(),
                        pr.getOperatorId(),
                        pr.getAccountId(),
                        pr.getAmount(),
                        pr.getIsApproved()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/payment-requests/{paymentRequestId}/approve")
    public ResponseEntity<PaymentRequestResponse> approvePaymentRequest(
            @PathVariable Long paymentRequestId) {
        
        var paymentRequestOpt = paymentService.approvePaymentRequest(paymentRequestId);
        
        if (paymentRequestOpt.isPresent()) {
            PaymentRequest paymentRequest = paymentRequestOpt.get();
            PaymentRequestResponse response = new PaymentRequestResponse(
                    paymentRequest.getId(),
                    paymentRequest.getOperatorId(),
                    paymentRequest.getAccountId(),
                    paymentRequest.getAmount(),
                    paymentRequest.getIsApproved()
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{operatorId}/cashout-requests")
    public ResponseEntity<List<CashoutRequestResponse>> getCashoutRequestsByOperatorId(
            @PathVariable Long operatorId) {
        
        List<CashoutRequest> cashoutRequests = cashoutService.getCashoutRequestsByOperatorId(operatorId);
        
        List<CashoutRequestResponse> responses = cashoutRequests.stream()
                .map(cr -> new CashoutRequestResponse(
                        cr.getId(),
                        cr.getOperatorId(),
                        cr.getAccountId(),
                        cr.getAmount(),
                        cr.getIsApproved()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/cashout-requests/{cashoutRequestId}/approve")
    public ResponseEntity<CashoutRequestResponse> approveCashoutRequest(
            @PathVariable Long cashoutRequestId) {
        
        var cashoutRequestOpt = cashoutService.approveCashoutRequest(cashoutRequestId);
        
        if (cashoutRequestOpt.isPresent()) {
            CashoutRequest cashoutRequest = cashoutRequestOpt.get();
            CashoutRequestResponse response = new CashoutRequestResponse(
                    cashoutRequest.getId(),
                    cashoutRequest.getOperatorId(),
                    cashoutRequest.getAccountId(),
                    cashoutRequest.getAmount(),
                    cashoutRequest.getIsApproved()
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{operatorId}/session/begin")
    public ResponseEntity<Void> beginSession(@PathVariable Long operatorId) {
        accountService.setAccountsActiveByOperatorId(operatorId, true);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{operatorId}/session/end")
    public ResponseEntity<Void> endSession(@PathVariable Long operatorId) {
        accountService.setAccountsActiveByOperatorId(operatorId, false);
        return ResponseEntity.ok().build();
    }
}
