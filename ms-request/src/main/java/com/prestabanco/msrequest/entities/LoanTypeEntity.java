package com.prestabanco.msrequest.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "loan_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanTypeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Define que el campo es autogenerado
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(nullable = false, unique = true) // Campo único y no nulo
    private String name;

    @Column(nullable = false)
    private int maxTermYears;

    @Column(nullable = false)
    private double minInterestRate;

    @Column(nullable = false)
    private double maxInterestRate;

    @Column(nullable = false)
    private double maxFinancingPercentage;
}
