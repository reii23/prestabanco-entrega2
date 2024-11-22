package com.prestabanco.msrequest.repositories;

import com.prestabanco.msrequest.entities.LoanTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanTypeRepository extends JpaRepository<LoanTypeEntity, Long> {
    LoanTypeEntity findByName(String name);
}
