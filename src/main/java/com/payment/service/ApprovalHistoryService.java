package com.payment.service;

import com.payment.dto.ApprovalHistoryItem;
import com.payment.entity.CashoutRequest;
import com.payment.entity.PaymentRequest;
import com.payment.repository.CashoutRequestRepository;
import com.payment.repository.PaymentRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApprovalHistoryService {

    private final PaymentRequestRepository paymentRequestRepository;
    private final CashoutRequestRepository cashoutRequestRepository;

    public List<ApprovalHistoryItem> getApprovalHistory(Long operatorId, LocalDateTime startDate, LocalDateTime endDate) {
        List<ApprovalHistoryItem> history = new ArrayList<>();

        // Получаем одобренные payment requests
        List<PaymentRequest> paymentRequests = paymentRequestRepository.findApprovedByFilters(
                operatorId, startDate, endDate
        );
        history.addAll(paymentRequests.stream()
                .map(pr -> new ApprovalHistoryItem(
                        pr.getId(),
                        "PAYMENT",
                        pr.getOperatorId(),
                        pr.getAccountId(),
                        pr.getAmount(),
                        pr.getIsApproved(),
                        pr.getCreatedAt(),
                        pr.getApprovedAt()
                ))
                .collect(Collectors.toList()));

        // Получаем одобренные cashout requests
        List<CashoutRequest> cashoutRequests = cashoutRequestRepository.findApprovedByFilters(
                operatorId, startDate, endDate
        );
        history.addAll(cashoutRequests.stream()
                .map(cr -> new ApprovalHistoryItem(
                        cr.getId(),
                        "CASHOUT",
                        cr.getOperatorId(),
                        cr.getAccountId(),
                        cr.getAmount(),
                        cr.getIsApproved(),
                        cr.getCreatedAt(),
                        cr.getApprovedAt()
                ))
                .collect(Collectors.toList()));

        // Сортируем по дате одобрения (от новых к старым)
        history.sort((a, b) -> {
            if (a.getApprovedAt() == null && b.getApprovedAt() == null) return 0;
            if (a.getApprovedAt() == null) return 1;
            if (b.getApprovedAt() == null) return -1;
            return b.getApprovedAt().compareTo(a.getApprovedAt());
        });

        return history;
    }
}
