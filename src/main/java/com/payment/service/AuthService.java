package com.payment.service;

import com.payment.entity.Operator;
import com.payment.repository.OperatorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final OperatorRepository operatorRepository;

    public Optional<Operator> authenticate(String username, String password) {
        return operatorRepository.findByUsernameAndPassword(username, password);
    }
}
