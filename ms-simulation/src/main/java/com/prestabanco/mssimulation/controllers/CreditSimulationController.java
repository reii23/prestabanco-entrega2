package com.prestabanco.mssimulation.controllers;

import com.prestabanco.mssimulation.services.CreditSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/simulation")
public class CreditSimulationController {

    @Autowired
    private CreditSimulationService creditSimulationService;

    @GetMapping("/calculate")
    public ResponseEntity<Double> calculateMonthlyFee(
            @RequestParam double loanAmount,
            @RequestParam double interestRate,
            @RequestParam int termYears
    ) {
        double monthlyFee = creditSimulationService.calculateMonthlyFee(loanAmount, interestRate, termYears);
        return ResponseEntity.ok(monthlyFee);
    }
}
