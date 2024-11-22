package com.prestabanco.msrequest.services;

import com.prestabanco.msrequest.entities.LoanTypeEntity;
import com.prestabanco.msrequest.repositories.LoanTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoanTypeService {

    @Autowired
    private LoanTypeRepository loanTypeRepository;

    // get all loan types
    public List<LoanTypeEntity> getAllLoanTypes() {
        return loanTypeRepository.findAll();
    }

    // get a loan type by ID
    public Optional<LoanTypeEntity> getLoanTypeById(Long id) {
        return loanTypeRepository.findById(id);
    }

    // save a new loan type
    public LoanTypeEntity saveLoanType(LoanTypeEntity loanType) {
        return loanTypeRepository.save(loanType);
    }

    // delete a loan type by ID
    public boolean deleteLoanTypeById(Long id) {
        try {
            loanTypeRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
