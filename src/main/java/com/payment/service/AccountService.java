package com.payment.service;

import com.payment.entity.Account;
import com.payment.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    @Transactional
    public void setAccountsActiveByOperatorId(Long operatorId, boolean isActive) {
        List<Account> accounts = accountRepository.findByOperatorId(operatorId);
        accounts.forEach(a -> a.setIsActive(isActive));
        accountRepository.saveAll(accounts);
    }
}
