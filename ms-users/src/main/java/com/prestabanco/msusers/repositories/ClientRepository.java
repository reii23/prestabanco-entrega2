package com.prestabanco.msusers.repositories;

import com.prestabanco.msusers.entities.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<ClientEntity, Long> {
    public ClientEntity findByRut(String rut);
    List<ClientEntity> findByAge(int age);
    List<ClientEntity> findBySalaryGreaterThan(Long salary);

}