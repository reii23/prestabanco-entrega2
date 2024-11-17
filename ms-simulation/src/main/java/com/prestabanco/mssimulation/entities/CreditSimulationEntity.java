package com.prestabanco.mssimulation.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="credit_simulation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditSimulationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCreditSimulation; // id credit simulation
    private Long loanAmount; //// loan amount by the user
    private int termYears; // term in years (ex: 1,2,3 years)
    private float interestRate; // interest rate
    private int loanType;
}

