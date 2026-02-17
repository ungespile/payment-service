package com.payment.controller;

import com.payment.dto.TopUpRequest;
import com.payment.dto.TopUpResponse;
import com.payment.entity.PaymentRequest;
import com.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/top-up")
    public ResponseEntity<TopUpResponse> topUp(
            @RequestHeader(value = "X-Operator-Id", required = false) Long operatorId,
            @Valid @RequestBody TopUpRequest request) {
        
        if (operatorId == null) {
            TopUpResponse response = new TopUpResponse(false, "Operator ID is required in header X-Operator-Id");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        var paymentRequestOpt = paymentService.createTopUpRequest(operatorId, request.getAmount());
        
        if (paymentRequestOpt.isPresent()) {
            PaymentRequest paymentRequest = paymentRequestOpt.get();
            TopUpResponse response = new TopUpResponse(
                true,
                "Payment request created successfully",
                paymentRequest.getId(),
                paymentRequest.getAccountId(),
                paymentRequest.getAmount()
            );
            return ResponseEntity.ok(response);
        } else {
            TopUpResponse response = new TopUpResponse(
                false,
                "No active account found with unchecked_available_amount less than the requested amount"
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
