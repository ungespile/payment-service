package com.payment.controller;

import com.payment.dto.CashoutRequestDto;
import com.payment.dto.CashoutResponse;
import com.payment.entity.CashoutRequest;
import com.payment.service.CashoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cashout")
@RequiredArgsConstructor
public class CashoutController {

    private final CashoutService cashoutService;

    @PostMapping("/request")
    public ResponseEntity<CashoutResponse> createCashoutRequest(@Valid @RequestBody CashoutRequestDto request) {
        var cashoutRequestOpt = cashoutService.createCashoutRequest(request.getAmount());
        
        if (cashoutRequestOpt.isPresent()) {
            CashoutRequest cashoutRequest = cashoutRequestOpt.get();
            CashoutResponse response = new CashoutResponse(
                true,
                "Cashout request created successfully",
                cashoutRequest.getId(),
                cashoutRequest.getAccountId(),
                cashoutRequest.getAmount()
            );
            return ResponseEntity.ok(response);
        } else {
            CashoutResponse response = new CashoutResponse(
                false,
                "No active account found with unchecked_available_amount greater than the requested amount"
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
