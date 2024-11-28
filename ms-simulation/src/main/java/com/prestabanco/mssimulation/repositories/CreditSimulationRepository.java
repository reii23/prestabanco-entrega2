package com.prestabanco.mssimulation.repositories;

import com.prestabanco.mssimulation.entities.CreditSimulationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditSimulationRepository extends JpaRepository<CreditSimulationEntity, Long> {
}
