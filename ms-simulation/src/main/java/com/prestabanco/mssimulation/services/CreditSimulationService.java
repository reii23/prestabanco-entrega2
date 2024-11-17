package com.prestabanco.mssimulation.services;

import com.prestabanco.mssimulation.entities.CreditSimulationEntity;
import com.prestabanco.mssimulation.repositories.CreditSimulationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreditSimulationService {
    @Autowired
    CreditSimulationRepository creditSimulationRepository;

    // save simulation: save data simulation
    public CreditSimulationEntity saveSimulation(CreditSimulationEntity creditSimulation) {
        return creditSimulationRepository.save(creditSimulation);
    }

    //calculate monthly fee (credit simulation monthly)
    public double calculateMonthlyFee(CreditSimulationEntity creditSimulation) {
        double loanAmount = creditSimulation.getLoanAmount();
        double interestRate = creditSimulation.getInterestRate();
        double interestRateMonthly = interestRate / 12 / 100;
        int termMonths = creditSimulation.getTermYears() * 12; // transform term years * months = total months

        // calculate monthly fee M = (P * ((r(1+r)**n / (1+r)**n -1))
        double monthlyFee = loanAmount * (interestRateMonthly * Math.pow(1 + interestRateMonthly, termMonths)) / (Math.pow(1 + interestRateMonthly, termMonths) - 1);

        return monthlyFee;

        // example:
        // loanAmount: 100,000,000
        // term: 20 (en años)
        // interestRateAnnual: 4,5%
        // interestRateMonthly: interestRateAnnual / 12 / 100: 0.00375

        //return: Monthly fee is: $ 632649.3762199708
    }
}
