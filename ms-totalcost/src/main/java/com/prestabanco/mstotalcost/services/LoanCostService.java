package com.prestabanco.mstotalcost.services;

import com.prestabanco.mstotalcost.clients.RequestFeignClient;
import com.prestabanco.mstotalcost.entities.CreditRequestEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoanCostService {

    @Autowired
    private RequestFeignClient requestFeignClient;

    public double calculateLoanCost(Long creditRequestId) {
        CreditRequestEntity creditRequest = requestFeignClient.getCreditRequestById(creditRequestId).getBody();

        if (creditRequest == null) {
            throw new IllegalArgumentException("Credit request not found");
        }

        double loanAmount = creditRequest.getRequestedAmount();
        int termYears = creditRequest.getTermYears();
        double annualInterestRate = creditRequest.getInterestRate();

        double monthlyInterestRate = (annualInterestRate / 12) / 100;
        int totalPayments = termYears * 12;
        double monthlyPayment = (loanAmount * monthlyInterestRate) /
                (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

        double lifeInsurance = loanAmount * 0.0003;
        double fireInsurance = 20000;
        double adminFee = loanAmount * 0.01;

        double totalMonthlyCost = monthlyPayment + lifeInsurance + fireInsurance;
        double totalLoanCost = (totalMonthlyCost * totalPayments) + adminFee;

        return totalLoanCost;
    }
}
