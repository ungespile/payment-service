package com.payment.controller;

import com.payment.dto.ApprovalHistoryItem;
import com.payment.dto.OperatorDto;
import com.payment.entity.Operator;
import com.payment.repository.OperatorRepository;
import com.payment.service.ApprovalHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ApprovalHistoryService approvalHistoryService;
    private final OperatorRepository operatorRepository;

    @GetMapping("/approval-history")
    public ResponseEntity<List<ApprovalHistoryItem>> getApprovalHistory(
            @RequestParam(required = false) Long operatorId,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime endDate) {

        List<ApprovalHistoryItem> history = approvalHistoryService.getApprovalHistory(
                operatorId, startDate, endDate
        );

        return ResponseEntity.ok(history);
    }

    @GetMapping("/operators")
    public ResponseEntity<List<OperatorDto>> getAllOperators() {
        List<Operator> operators = operatorRepository.findAll();
        List<OperatorDto> operatorDtos = operators.stream()
                .map(op -> new OperatorDto(
                        op.getOperatorId(),
                        op.getUsername(),
                        op.getRole()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(operatorDtos);
    }
}
