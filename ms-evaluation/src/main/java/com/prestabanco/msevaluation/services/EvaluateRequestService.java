package com.prestabanco.msevaluation.services;

import com.prestabanco.msevaluation.clients.RequestFeignClient;
import com.prestabanco.msevaluation.clients.UsersFeignClient;
import com.prestabanco.msevaluation.entities.ClientEntity;
import com.prestabanco.msevaluation.entities.CreditRequestEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EvaluateRequestService {

    @Autowired
    private RequestFeignClient requestFeignClient;

    @Autowired
    private UsersFeignClient usersFeignClient;

    // evaluate credit request
    public String evaluateCreditRequest(Long creditRequestId, CreditRequestEntity evaluationData) {

        // get credit request by id
        CreditRequestEntity creditRequest = requestFeignClient.getCreditRequestById(creditRequestId).getBody();
        if (creditRequest == null) {
            throw new IllegalArgumentException("Solicitud de crédito no encontrada");
        }

        // get client by id
        ClientEntity client = usersFeignClient.getClientById(creditRequest.getClientId()).getBody();
        if (client == null) {
            throw new IllegalArgumentException("Cliente no encontrado");
        }

        // is eligible: apply evaluation rules
        boolean isEligible = applyEvaluationRules(creditRequest, client, evaluationData);

        // elegible = aprobado no elegible = rechazado
        if (isEligible) {
            creditRequest.setStatus("APROBADO");
            requestFeignClient.updateCreditRequest(creditRequestId, creditRequest);
            return "La solicitud de crédito ha sido aprobada";
        } else {
            creditRequest.setStatus("RECHAZADO");
            requestFeignClient.updateCreditRequest(creditRequestId, creditRequest);
            return "La solicitud de crédito ha sido rechazada";
        }
    }

    // apply evaluation rules
    private boolean applyEvaluationRules(CreditRequestEntity creditRequest, ClientEntity client, CreditRequestEntity evaluationData) {
        double paymentToIncomeRatio = calculatePaymentToIncomeRatio(client.getSalary(), creditRequest);
        double debtToIncomeRatio = calculateDebtToIncomeRatio(client.getSalary(), creditRequest);

        return evaluationData.getR1PaymentToIncome() && paymentToIncomeRatio <= 25 &&
                evaluationData.getR2CreditHistory() &&
                evaluationData.getR3EmploymentStability() &&
                debtToIncomeRatio <= 40 &&
                evaluationData.getR6AgeRestriction();
    }

    // calculate the payment to income ratio
    private double calculatePaymentToIncomeRatio(double salary, CreditRequestEntity creditRequest) {
        double monthlyPayment = calculateMonthlyPayment(creditRequest);
        return (monthlyPayment / salary) * 100;
    }

    // calculate debt to income ratio
    private double calculateDebtToIncomeRatio(double salary, CreditRequestEntity creditRequest) {
        double monthlyPayment = calculateMonthlyPayment(creditRequest);
        double expenses = creditRequest.getExpenses();
        return ((monthlyPayment + expenses) / salary) * 100;
    }

    // calculate monthly payment
    private double calculateMonthlyPayment(CreditRequestEntity creditRequest) {
        double loanAmount = creditRequest.getRequestedAmount();
        double interestRate = creditRequest.getInterestRate() / 12 / 100;
        int totalPayments = creditRequest.getTermYears() * 12;

        return (loanAmount * interestRate) /
                (1 - Math.pow(1 + interestRate, -totalPayments));
    }
}
