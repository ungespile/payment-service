package com.payment.service;

import com.payment.entity.Account;
import com.payment.entity.CashoutRequest;
import com.payment.repository.AccountRepository;
import com.payment.repository.CashoutRequestRepository;
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
public class CashoutService {

    private final AccountRepository accountRepository;
    private final CashoutRequestRepository cashoutRequestRepository;

    @Transactional
    public Optional<CashoutRequest> createCashoutRequest(Long operatorId, BigDecimal amount) {
        // Находим первую запись из accounts с is_active=true и unchecked_available_amount < amount
        Pageable pageable = PageRequest.of(0, 1);
        List<Account> accounts = accountRepository.findActiveAccountsWithUncheckedAmountLessThan(amount, pageable);
        
        if (accounts.isEmpty()) {
            return Optional.empty();
        }
        
        Account account = accounts.get(0);
        
        // Создаем запись в cashout_requests
        CashoutRequest cashoutRequest = CashoutRequest.builder()
                .operatorId(operatorId)
                .accountId(account.getId())
                .amount(amount)
                .isApproved(false)
                .build();
        
        CashoutRequest savedRequest = cashoutRequestRepository.save(cashoutRequest);
        
        return Optional.of(savedRequest);
    }
}
