package com.payment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "operators")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"operatorId", "username"})
public class Operator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "operator_id")
    private Long operatorId;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "role", nullable = false)
    private String role = "OPERATOR";
}
