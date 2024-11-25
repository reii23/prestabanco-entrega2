package com.prestabanco.msrequest.controllers;

import com.prestabanco.msrequest.entities.CreditRequestEntity;
import com.prestabanco.msrequest.services.CreditRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/request")
public class CreditRequestController {
    @Autowired
    CreditRequestService creditRequestService;

    // get all credit requests
    @GetMapping("/")
    public ResponseEntity<ArrayList<CreditRequestEntity>> getAllCreditRequests() {
        ArrayList<CreditRequestEntity> creditRequests = creditRequestService.getAllRequests();
        return ResponseEntity.ok(creditRequests);
    }

    // get one request by the ID
    @GetMapping("/{id}")
    public ResponseEntity<Optional<CreditRequestEntity>> getCreditRequestById(@PathVariable Long id) {
        Optional<CreditRequestEntity> creditRequest = creditRequestService.getRequestById(id);
        return ResponseEntity.ok(creditRequest);
    }

    // get requests by client ID
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CreditRequestEntity>> getCreditRequestByClientId(@PathVariable Long clientId) {
        List<CreditRequestEntity> creditRequests = creditRequestService.getRequestByClientId(clientId);
        return ResponseEntity.ok(creditRequests);
    }

    // get all requests by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CreditRequestEntity>> getCreditRequestByStatus(@PathVariable String status) {
        List<CreditRequestEntity> creditRequests = creditRequestService.getRequestByState(status);
        return ResponseEntity.ok(creditRequests);
    }

    // save a credit request
    @PostMapping("/")
    public ResponseEntity<CreditRequestEntity> saveCreditRequest(
            @RequestParam("clientId") Long clientId,
            @RequestParam("expenses") Long expenses,
            @RequestParam("loanTypeId") Long loanTypeId,
            @RequestParam("loanType") String loanType,
            @RequestParam("requestedAmount") Double requestedAmount,
            @RequestParam("termYears") int termYears,
            @RequestParam("interestRate") Double interestRate,
            @RequestParam("status") String status,
            @RequestParam(value = "incomeProofPdf", required = false) MultipartFile incomeProofPdf,
            @RequestParam(value = "propertyValuationPdf", required = false) MultipartFile propertyValuationPdf,
            @RequestParam(value = "creditHistoryPdf", required = false) MultipartFile creditHistoryPdf,
            @RequestParam(value = "firstPropertyDeedPdf", required = false) MultipartFile firstPropertyDeedPdf,
            @RequestParam(value = "businessPlanPdf", required = false) MultipartFile businessPlanPdf,
            @RequestParam(value = "renovationBudgetPdf", required = false) MultipartFile renovationBudgetPdf,
            @RequestParam(value = "financialStateBusinessPdf", required = false) MultipartFile financialStateBusinessPdf
    ) throws IOException {
        CreditRequestEntity savedRequest = creditRequestService.saveCreditRequest(
                clientId, expenses, loanTypeId, loanType, requestedAmount, termYears, interestRate,
                status, incomeProofPdf, propertyValuationPdf, creditHistoryPdf,
                renovationBudgetPdf, businessPlanPdf, firstPropertyDeedPdf, financialStateBusinessPdf
        );
        return ResponseEntity.ok(savedRequest);
    }

    // Update a credit request
    @PutMapping("/{id}")
    public ResponseEntity<CreditRequestEntity> updateCreditRequest(@PathVariable Long id, @RequestBody CreditRequestEntity creditRequest) {
        Optional<CreditRequestEntity> existingRequest = creditRequestService.getRequestById(id);
        if (existingRequest.isPresent()) {
            creditRequest.setIdCreditRequest(id);
            CreditRequestEntity updatedRequest = creditRequestService.updateCreditRequest(creditRequest);
            return ResponseEntity.ok(updatedRequest);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a credit request by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCreditRequestById(@PathVariable Long id) {
        boolean isDeleted = creditRequestService.deleteCreditRequestById(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // get pdf income proof in credit request
    @GetMapping("/{id}/incomeProofPdf")
    public ResponseEntity<byte[]> getIncomeProofPdf(@PathVariable Long id) {
        Optional<CreditRequestEntity> creditRequest = creditRequestService.getRequestById(id);
        if (creditRequest.isPresent() && creditRequest.get().getIncomeProofPdf() != null) {
            byte[] pdfBytes = creditRequest.get().getIncomeProofPdf();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "incomeProof.pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // get pdf property valuation in credit request
    @GetMapping("/{id}/propertyValuationPdf")
    public ResponseEntity<byte[]> getPropertyValuationPdf(@PathVariable Long id) {
        Optional<CreditRequestEntity> creditRequest = creditRequestService.getRequestById(id);
        if (creditRequest.isPresent() && creditRequest.get().getPropertyValuationPdf() != null) {
            byte[] pdfBytes = creditRequest.get().getPropertyValuationPdf();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "propertyValuation.pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // get credit history pdf in credit request
    @GetMapping("/{id}/creditHistoryPdf")
    public ResponseEntity<byte[]> getCreditHistoryPdf(@PathVariable Long id) {
        Optional<CreditRequestEntity> creditRequest = creditRequestService.getRequestById(id);
        if (creditRequest.isPresent() && creditRequest.get().getCreditHistoryPdf() != null) {
            byte[] pdfBytes = creditRequest.get().getCreditHistoryPdf();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "creditHistory.pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // get first property deed pdf in credit request
    @GetMapping("/{id}/firstPropertyDeedPdf")
    public ResponseEntity<byte[]> getFirstPropertyDeedPdf(@PathVariable Long id) {
        Optional<CreditRequestEntity> creditRequest = creditRequestService.getRequestById(id);
        if (creditRequest.isPresent() && creditRequest.get().getFirstPropertyDeedPdf() != null) {
            byte[] pdfBytes = creditRequest.get().getFirstPropertyDeedPdf();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "firstPropertyDeed.pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // get business plan pdf in credit request
    @GetMapping("/{id}/businessPlanPdf")
    public ResponseEntity<byte[]> getBusinessPlanPdf(@PathVariable Long id) {
        Optional<CreditRequestEntity> creditRequest = creditRequestService.getRequestById(id);
        if (creditRequest.isPresent() && creditRequest.get().getBusinessPlanPdf() != null) {
            byte[] pdfBytes = creditRequest.get().getBusinessPlanPdf();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "businessPlan.pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // get renovation budget pdf in credit request
    @GetMapping("/{id}/renovationBudgetPdf")
    public ResponseEntity<byte[]> getRenovationBudgetPdf(@PathVariable Long id) {
        Optional<CreditRequestEntity> creditRequest = creditRequestService.getRequestById(id);
        if (creditRequest.isPresent() && creditRequest.get().getRenovationBudgetPdf() != null) {
            byte[] pdfBytes = creditRequest.get().getRenovationBudgetPdf();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "renovationBudget.pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // get financial state business pdf in credit request
    @GetMapping("/{id}/financialStateBusinessPdf")
    public ResponseEntity<byte[]> getFinancialStateBusinessPdf(@PathVariable Long id) {
        Optional<CreditRequestEntity> creditRequest = creditRequestService.getRequestById(id);
        if (creditRequest.isPresent() && creditRequest.get().getFinancialStateBusinessPdf() != null) {
            byte[] pdfBytes = creditRequest.get().getFinancialStateBusinessPdf();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "financialStateBusiness.pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
