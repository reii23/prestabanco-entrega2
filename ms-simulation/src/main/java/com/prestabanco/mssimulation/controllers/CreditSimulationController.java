package com.prestabanco.mssimulation.controllers;

import com.prestabanco.mssimulation.entities.CreditSimulationEntity;
import com.prestabanco.mssimulation.services.CreditSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/simulation") // url CreditSimulationController
public class CreditSimulationController {
    @Autowired
    CreditSimulationService creditSimulationService;

    // H1: CREDIT SIMULATION
    @PostMapping("/")
    public ResponseEntity<String> simulateCredit(@RequestBody CreditSimulationEntity creditSimulation) {
        creditSimulationService.saveSimulation(creditSimulation);
        double monthlyFee = creditSimulationService.calculateMonthlyFee(creditSimulation);
        return ResponseEntity.ok(String.valueOf(monthlyFee));
    }
}
