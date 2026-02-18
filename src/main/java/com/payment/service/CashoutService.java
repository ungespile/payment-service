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
    public Optional<CashoutRequest> createCashoutRequest(BigDecimal amount) {
        // Находим первую запись из accounts с is_active=true и unchecked_available_amount > amount
        Pageable pageable = PageRequest.of(0, 1);
        List<Account> accounts = accountRepository.findActiveAccountsWithUncheckedAmountGreaterThan(amount, pageable);
        
        if (accounts.isEmpty()) {
            return Optional.empty();
        }
        
        Account account = accounts.get(0);
        
        // Устанавливаем is_used = true у выбранного счета
        account.setIsUsed(true);
        accountRepository.save(account);
        
        // Создаем запись в cashout_requests с operator_id из выбранного account
        CashoutRequest cashoutRequest = CashoutRequest.builder()
                .operatorId(account.getOperatorId())
                .accountId(account.getId())
                .amount(amount)
                .isApproved(false)
                .build();
        
        CashoutRequest savedRequest = cashoutRequestRepository.save(cashoutRequest);
        
        return Optional.of(savedRequest);
    }

    public List<CashoutRequest> getCashoutRequestsByOperatorId(Long operatorId) {
        return cashoutRequestRepository.findByOperatorId(operatorId);
    }

    @Transactional
    public Optional<CashoutRequest> approveCashoutRequest(Long cashoutRequestId) {
        Optional<CashoutRequest> cashoutRequestOpt = cashoutRequestRepository.findById(cashoutRequestId);
        
        if (cashoutRequestOpt.isPresent()) {
            CashoutRequest cashoutRequest = cashoutRequestOpt.get();
            cashoutRequest.setIsApproved(true);
            cashoutRequest.setApprovedAt(java.time.LocalDateTime.now());
            CashoutRequest savedRequest = cashoutRequestRepository.save(cashoutRequest);
            
            // Устанавливаем is_used = false у счета по accountId
            Optional<Account> accountOpt = accountRepository.findById(cashoutRequest.getAccountId());
            if (accountOpt.isPresent()) {
                Account account = accountOpt.get();
                account.setIsUsed(false);
                accountRepository.save(account);
            }
            
            return Optional.of(savedRequest);
        }
        
        return Optional.empty();
    }
}
