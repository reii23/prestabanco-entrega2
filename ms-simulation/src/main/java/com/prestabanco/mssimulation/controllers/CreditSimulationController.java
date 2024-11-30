package com.prestabanco.mssimulation.controllers;

import com.prestabanco.mssimulation.services.CreditSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/simulation")
public class CreditSimulationController {

    @Autowired
    private CreditSimulationService creditSimulationService;

    @PostMapping("/")
    public ResponseEntity<Double> calculateMonthlyFee(@RequestBody Map<String, Object> requestData) {
        double loanAmount = Double.parseDouble(requestData.get("loanAmount").toString());
        double interestRate = Double.parseDouble(requestData.get("interestRate").toString());
        int termYears = Integer.parseInt(requestData.get("termYears").toString());

        double monthlyFee = creditSimulationService.calculateMonthlyFee(loanAmount, interestRate, termYears);
        return ResponseEntity.ok(monthlyFee);
    }
}
