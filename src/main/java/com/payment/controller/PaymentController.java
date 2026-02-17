package com.payment.controller;

import com.payment.dto.TopUpRequest;
import com.payment.dto.TopUpResponse;
import com.payment.entity.PaymentRequest;
import com.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/top-up")
    public ResponseEntity<TopUpResponse> topUp(@Valid @RequestBody TopUpRequest request) {
        var paymentRequestOpt = paymentService.createTopUpRequest(request.getAmount());
        
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
                "No active account found with unchecked_available_amount greater than the requested amount"
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
