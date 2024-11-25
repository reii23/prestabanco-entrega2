package com.prestabanco.msrequest.controllers;

import com.prestabanco.msrequest.entities.LoanTypeEntity;
import com.prestabanco.msrequest.services.LoanTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/LoanType")
public class LoanTypeController {

    @Autowired
    private LoanTypeService loanTypeService;

    // get all loan types
    @GetMapping("/")
    public ResponseEntity<List<LoanTypeEntity>> getAllLoanTypes() {
        return ResponseEntity.ok(loanTypeService.getAllLoanTypes());
    }

    // get a loan type by id
    @GetMapping("/{id}")
    public ResponseEntity<Optional<LoanTypeEntity>> getLoanTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(loanTypeService.getLoanTypeById(id));
    }

    // save a new loan type
    @PostMapping("/")
    public ResponseEntity<LoanTypeEntity> saveLoanType(@RequestBody LoanTypeEntity loanType) {
        return ResponseEntity.ok(loanTypeService.saveLoanType(loanType));
    }

    // delete a loan type by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoanTypeById(@PathVariable Long id) {
        boolean isDeleted = loanTypeService.deleteLoanTypeById(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
