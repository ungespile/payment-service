package com.payment.service;

import com.payment.entity.Account;
import com.payment.entity.PaymentRequest;
import com.payment.repository.AccountRepository;
import com.payment.repository.PaymentRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final AccountRepository accountRepository;
    private final PaymentRequestRepository paymentRequestRepository;

    @Transactional
    public Optional<PaymentRequest> createTopUpRequest(BigDecimal amount) {
        // Находим первую запись из accounts с is_active=true и unchecked_available_amount < amount
        Pageable pageable = PageRequest.of(0, 1);
        List<Account> accounts = accountRepository.findActiveAccountsWithUncheckedAmountLessThan(amount, pageable);
        
        if (accounts.isEmpty()) {
            return Optional.empty();
        }
        
        Account account = accounts.get(0);
        
        // Создаем запись в payment_requests с operator_id из выбранного account
        PaymentRequest paymentRequest = PaymentRequest.builder()
                .operatorId(account.getOperatorId())
                .accountId(account.getId())
                .amount(amount)
                .isApproved(false)
                .build();
        
        PaymentRequest savedRequest = paymentRequestRepository.save(paymentRequest);
        
        return Optional.of(savedRequest);
    }

    public List<PaymentRequest> getPaymentRequestsByOperatorId(Long operatorId) {
        return paymentRequestRepository.findByOperatorId(operatorId);
    }

    @Transactional
    public Optional<PaymentRequest> approvePaymentRequest(Long paymentRequestId) {
        Optional<PaymentRequest> paymentRequestOpt = paymentRequestRepository.findById(paymentRequestId);
        
        if (paymentRequestOpt.isPresent()) {
            PaymentRequest paymentRequest = paymentRequestOpt.get();
            paymentRequest.setIsApproved(true);
            PaymentRequest savedRequest = paymentRequestRepository.save(paymentRequest);
            return Optional.of(savedRequest);
        }
        
        return Optional.empty();
    }
}
