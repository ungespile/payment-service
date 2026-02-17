package com.payment.controller;

import com.payment.dto.PaymentRequestResponse;
import com.payment.entity.PaymentRequest;
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
}
