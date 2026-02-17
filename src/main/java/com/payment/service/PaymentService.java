package com.payment.service;

import com.payment.entity.Account;
import com.payment.entity.PaymentRequest;
import com.payment.repository.AccountRepository;
import com.payment.repository.PaymentRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final AccountRepository accountRepository;
    private final PaymentRequestRepository paymentRequestRepository;

    @Autowired
    public PaymentService(AccountRepository accountRepository, 
                          PaymentRequestRepository paymentRequestRepository) {
        this.accountRepository = accountRepository;
        this.paymentRequestRepository = paymentRequestRepository;
    }

    @Transactional
    public Optional<PaymentRequest> createTopUpRequest(Long operatorId, BigDecimal amount) {
        // Находим первую запись из accounts с is_active=true и unchecked_available_amount < amount
        Pageable pageable = PageRequest.of(0, 1);
        List<Account> accounts = accountRepository.findActiveAccountsWithUncheckedAmountLessThan(amount, pageable);
        
        if (accounts.isEmpty()) {
            return Optional.empty();
        }
        
        Account account = accounts.get(0);
        
        // Создаем запись в payment_requests
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setOperatorId(operatorId);
        paymentRequest.setAccountId(account.getId());
        paymentRequest.setAmount(amount);
        paymentRequest.setIsApproved(false);
        
        PaymentRequest savedRequest = paymentRequestRepository.save(paymentRequest);
        
        return Optional.of(savedRequest);
    }
}
