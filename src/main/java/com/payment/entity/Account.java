package com.payment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = {"id", "accountNumber"})
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "operator_id", nullable = false)
    private Long operatorId;

    @Column(name = "account_number", nullable = false, unique = true)
    private String accountNumber;

    @Column(name = "available_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal availableAmount;

    @Column(name = "unchecked_available_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal uncheckedAvailableAmount;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "is_used", nullable = false)
    private Boolean isUsed;
}
