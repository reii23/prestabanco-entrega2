package com.prestabanco.mssimulation.services;

import org.springframework.stereotype.Service;

@Service
public class CreditSimulationService {
    public double calculateMonthlyFee(double loanAmount, double interestRate, int termYears) {
        double interestRateMonthly = interestRate / 12 / 100; // Tasa de interés mensual
        int termMonths = termYears * 12; // Plazo en meses
        return loanAmount * (interestRateMonthly * Math.pow(1 + interestRateMonthly, termMonths))
                / (Math.pow(1 + interestRateMonthly, termMonths) - 1);
    }
}
