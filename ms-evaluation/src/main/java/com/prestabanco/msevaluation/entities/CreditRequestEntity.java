package com.prestabanco.msevaluation.entities;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreditRequestEntity {
    private Long idCreditRequest;
    private Long clientId;
    private Long expenses;
    private Long loanTypeId;
    private String loanType;
    private Double requestedAmount;
    private int termYears;
    private Double interestRate;
    private String status;

    // Evaluation requirements
    private Boolean r1PaymentToIncome;
    private Boolean r2CreditHistory;
    private Boolean r3EmploymentStability;
    private Boolean r4DebtToIncome;
    private Boolean r5MaxFinancing;
    private Boolean r6AgeRestriction;

    // Saving capacity requirements
    private Boolean r71MinimumBalance;
    private Boolean r72ConsistentSavingsHistory;
    private Boolean r73PeriodicDeposits;
    private Boolean r74BalanceYearsRatio;
    private Boolean r75RecentWithdrawals;
    private String r7SavingsCapacity;

    // Documents as byte arrays
    private byte[] incomeProofPdf;
    private byte[] propertyValuationPdf;
    private byte[] creditHistoryPdf;
    private byte[] firstPropertyDeedPdf;
    private byte[] businessPlanPdf;
    private byte[] renovationBudgetPdf;
    private byte[] financialStateBusinessPdf;
}
