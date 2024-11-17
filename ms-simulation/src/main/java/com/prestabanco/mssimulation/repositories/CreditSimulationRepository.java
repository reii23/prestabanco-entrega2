package com.prestabanco.mssimulation.repositories;

import com.prestabanco.mssimulation.entities.CreditSimulationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditSimulationRepository extends JpaRepository<CreditSimulationEntity, Long> {
}
