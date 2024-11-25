package com.prestabanco.msevaluation.controllers;

import com.prestabanco.msevaluation.entities.CreditRequestEntity;
import com.prestabanco.msevaluation.services.EvaluateRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/evaluation")
public class EvaluateRequestController {

    @Autowired
    private EvaluateRequestService evaluateRequestService;

    @PostMapping("/evaluate/{id}")
    public ResponseEntity<String> evaluateCreditRequest(@PathVariable Long id, @RequestBody CreditRequestEntity evaluationData) {
        try {
            String result = evaluateRequestService.evaluateCreditRequest(id, evaluationData);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
