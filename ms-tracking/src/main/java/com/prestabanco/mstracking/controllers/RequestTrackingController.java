package com.prestabanco.mstracking.controllers;

import com.prestabanco.mstracking.entities.CreditRequestEntity;
import com.prestabanco.mstracking.services.RequestTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/tracking")
public class RequestTrackingController {

    @Autowired
    private RequestTrackingService requestTrackingService;

    // get state of a credit request by id
    @GetMapping("/{id}/status")
    public ResponseEntity<String> getCreditRequestStatus(@PathVariable Long id) {
        Optional<CreditRequestEntity> creditRequest = requestTrackingService.getRequestById(id);
        if (creditRequest.isPresent()) {
            String status = creditRequest.get().getStatus();
            return ResponseEntity.ok(status);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Credit request not found");
        }
    }

    // get all credit requests by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CreditRequestEntity>> getCreditRequestByStatus(@PathVariable String status) {
        List<CreditRequestEntity> creditRequests = requestTrackingService.getRequestsByState(status);
        return ResponseEntity.ok(creditRequests);
    }
}
