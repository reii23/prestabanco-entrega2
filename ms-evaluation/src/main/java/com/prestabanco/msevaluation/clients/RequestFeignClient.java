package com.prestabanco.msevaluation.clients;

import com.prestabanco.msevaluation.entities.CreditRequestEntity;
import com.prestabanco.msevaluation.configurations.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@FeignClient(value = "ms-request", path = "/api/v1/request", configuration = {FeignClientConfig.class})
public interface RequestFeignClient {

    // get all credit request
    @GetMapping("/")
    ResponseEntity<List<CreditRequestEntity>> getAllCreditRequests();

    // get credit request by id
    @GetMapping("/{id}")
    ResponseEntity<CreditRequestEntity> getCreditRequestById(@PathVariable("id") Long id);

    // get requests by client ID
    @GetMapping("/client/{clientId}")
    ResponseEntity<List<CreditRequestEntity>> getCreditRequestByClientId(@PathVariable("clientId") Long clientId);

    // get all requests by statius
    @GetMapping("/status/{status}")
    ResponseEntity<List<CreditRequestEntity>> getCreditRequestByStatus(@PathVariable("status") String status);

    // save a credit request
    @PostMapping("/")
    ResponseEntity<CreditRequestEntity> saveCreditRequest(@RequestBody CreditRequestEntity creditRequest);

    // update credit request
    @PutMapping("/{id}")
    ResponseEntity<CreditRequestEntity> updateCreditRequest(@PathVariable("id") Long id, @RequestBody CreditRequestEntity creditRequest);

    // delete a credit request by id
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteCreditRequestById(@PathVariable("id") Long id);
}
