package com.payment.controller;

import com.payment.dto.LoginRequest;
import com.payment.dto.LoginResponse;
import com.payment.entity.Operator;
import com.payment.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        var operatorOpt = authService.authenticate(request.getUsername(), request.getPassword());
        
        if (operatorOpt.isPresent()) {
            Operator operator = operatorOpt.get();
            LoginResponse response = new LoginResponse(
                true,
                "Login successful",
                operator.getOperatorId(),
                operator.getUsername()
            );
            return ResponseEntity.ok(response);
        } else {
            LoginResponse response = new LoginResponse(false, "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
