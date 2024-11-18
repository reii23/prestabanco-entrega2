package com.prestabanco.msrequest.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "credit_request")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditRequestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long idCreditRequest;

    // save the PK Client (clientId) to complete the fields
    @Column(nullable = false)
    private Long clientId;

    // personalInfo client
    private Long expenses;

    // id type (first property, second property)
    @Column(nullable = false)
    private Long loanTypeId;

    // Loan information
    private String loanType; // first, second dwelling, etc
    private Double requestedAmount;
    private int termYears;
    private Double interestRate;

    // Loan status
    private String status; // loan approved, rejected, under review

    // Evaluation requirements
    private Boolean r1PaymentToIncome; // R1
    private Boolean r2CreditHistory;   // R2
    private Boolean r3EmploymentStability; // R3
    private Boolean r4DebtToIncome;    // R4
    private Boolean r5MaxFinancing;    // R5
    private Boolean r6AgeRestriction;  // R6

    // Saving capacity requirements
    private Boolean r71MinimumBalance;
    private Boolean r72ConsistentSavingsHistory;
    private Boolean r73PeriodicDeposits;
    private Boolean r74BalanceYearsRatio;
    private Boolean r75RecentWithdrawals;
    private String r7SavingsCapacity;

    // DOCUMENTS: all documents for credit request in @Lob to work with bytes
    @Lob
    @Column(name = "income_proof_pdf")
    private byte[] incomeProofPdf; // NEEDED FOR: all loans

    @Lob
    @Column(name = "property_valuation_pdf")
    private byte[] propertyValuationPdf; // NEEDED FOR: first dwelling, second dwelling, commercial property,remodeling

    @Lob
    @Column(name = "credit_history_pdf")
    private byte[] creditHistoryPdf; // NEEDED FOR: first dwelling, second dwelling

    @Lob
    @Column(name = "first_property_deed_pdf")
    private byte[] firstPropertyDeedPdf; // NEEDED FOR: second dwelling

    @Lob
    @Column(name = "business_plan_pdf")
    private byte[] businessPlanPdf; // NEEDED FOR: property commercial

    @Lob
    @Column(name = "renovation_budget_pdf")
    private byte[] renovationBudgetPdf; // NEEDED FOR: remodeling

    @Lob
    @Column(name = "financial_state_business_pdf")
    private byte[] financialStateBusinessPdf; // NEEDED FOR: property commercial
}