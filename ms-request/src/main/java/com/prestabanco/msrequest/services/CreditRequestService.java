package com.prestabanco.msrequest.services;

import com.prestabanco.msrequest.clients.UsersFeignClient;
import com.prestabanco.msrequest.entities.CreditRequestEntity;
import com.prestabanco.msrequest.repositories.CreditRequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CreditRequestService {
    @Autowired
    private UsersFeignClient usersFeignClient;
    @Autowired
    private CreditRequestRepository creditRequestRepository;

    // get all credit requests
    public ArrayList<CreditRequestEntity> getAllRequests() {
        return (ArrayList<CreditRequestEntity>) creditRequestRepository.findAll();
    }

    public Optional<CreditRequestEntity> getRequestById(Long id) {
        return creditRequestRepository.findById(id);
    }

    // get a credit request by clientId
    public List<CreditRequestEntity> getRequestByClientId(Long clientId) {
        return creditRequestRepository.findByClientId(clientId);
    }

    // find list of credit request by loanType
    public List<CreditRequestEntity> getRequestByLoanType(String loanType) {
        return creditRequestRepository.findByLoanType(loanType);
    }

    // find list of credit request by state
    public List<CreditRequestEntity> getRequestByState(String status) {
        return creditRequestRepository.findByStatus(status);
    }

    // Save a new credit request
    public CreditRequestEntity saveCreditRequest(
            Long clientId, Long expenses, Long loanTypeId, String loanType, Double requestedAmount,
            int termYears, Double interestRate, String status, MultipartFile incomeProofPdf,
            MultipartFile propertyValuationPdf, MultipartFile creditHistoryPdf, MultipartFile renovationBudgetPdf,
            MultipartFile businessPlanPdf, MultipartFile firstPropertyDeedPdf, MultipartFile financialStateBusinessPdf
    ) throws IOException {
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        creditRequest.setClientId(clientId);
        creditRequest.setExpenses(expenses);
        creditRequest.setLoanTypeId(loanTypeId);
        creditRequest.setLoanType(loanType);
        creditRequest.setRequestedAmount(requestedAmount);
        creditRequest.setTermYears(termYears);
        creditRequest.setInterestRate(interestRate);
        creditRequest.setStatus(status);

        if (incomeProofPdf != null && !incomeProofPdf.isEmpty()) {
            creditRequest.setIncomeProofPdf(incomeProofPdf.getBytes());
        }

        if (propertyValuationPdf != null && !propertyValuationPdf.isEmpty()) {
            creditRequest.setPropertyValuationPdf(propertyValuationPdf.getBytes());
        }

        if (creditHistoryPdf != null && !creditHistoryPdf.isEmpty()) {
            creditRequest.setCreditHistoryPdf(creditHistoryPdf.getBytes());
        }

        if (renovationBudgetPdf != null && !renovationBudgetPdf.isEmpty()) {
            creditRequest.setRenovationBudgetPdf(renovationBudgetPdf.getBytes());
        }

        if (businessPlanPdf != null && !businessPlanPdf.isEmpty()) {
            creditRequest.setBusinessPlanPdf(businessPlanPdf.getBytes());
        }

        if (firstPropertyDeedPdf != null && !firstPropertyDeedPdf.isEmpty()) {
            creditRequest.setFirstPropertyDeedPdf(firstPropertyDeedPdf.getBytes());
        }

        if (financialStateBusinessPdf != null && !financialStateBusinessPdf.isEmpty()) {
            creditRequest.setFinancialStateBusinessPdf(financialStateBusinessPdf.getBytes());
        }

        return creditRequestRepository.save(creditRequest);
    }

    // update a credit request
    public CreditRequestEntity updateCreditRequest(CreditRequestEntity creditRequest) {
        return creditRequestRepository.save(creditRequest);
    }

    // delete a credit request by id
    public boolean deleteCreditRequestById(Long id) {
        try {
            creditRequestRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
