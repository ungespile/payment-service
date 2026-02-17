package com.payment.service;

import com.payment.entity.Operator;
import com.payment.repository.OperatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final OperatorRepository operatorRepository;

    @Autowired
    public AuthService(OperatorRepository operatorRepository) {
        this.operatorRepository = operatorRepository;
    }

    public Optional<Operator> authenticate(String username, String password) {
        return operatorRepository.findByUsernameAndPassword(username, password);
    }
}
