package com.prestabanco.msrequest.repositories;

import com.prestabanco.msrequest.entities.CreditRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CreditRequestRepository extends JpaRepository<CreditRequestEntity, Long> {

    // List all request by clientId
    List<CreditRequestEntity> findByClientId(Long clientId);

    // List the request by loanType
    List<CreditRequestEntity> findByLoanType(String loanType);

    // List the request by state (approved, rejected)
    List<CreditRequestEntity> findByStatus(String status);

}