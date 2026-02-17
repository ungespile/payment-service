package com.payment.repository;

import com.payment.entity.Operator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OperatorRepository extends JpaRepository<Operator, Long> {
    
    Optional<Operator> findByUsername(String username);
    
    Optional<Operator> findByUsernameAndPassword(String username, String password);
}
