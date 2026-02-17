package com.payment.entity;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "operators")
public class Operator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "operator_id")
    private Long operatorId;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    public Operator() {
    }

    public Operator(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public Long getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(Long operatorId) {
        this.operatorId = operatorId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Operator operator = (Operator) o;
        return Objects.equals(operatorId, operator.operatorId) &&
               Objects.equals(username, operator.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(operatorId, username);
    }
}
