package com.prestabanco.msevaluation.clients;

import com.prestabanco.msevaluation.configurations.FeignClientConfig;
import com.prestabanco.msevaluation.entities.ClientEntity;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(value = "ms-users", path = "/api/v1/users", configuration = {FeignClientConfig.class})
public interface UsersFeignClient {

    // get all clients
    @GetMapping("/")
    ResponseEntity<List<ClientEntity>> getAllClients();

    // get a client by ID
    @GetMapping("/{id}")
    ResponseEntity<ClientEntity> getClientById(@PathVariable("id") Long id);

    // get a client by RUT
    @GetMapping("/rut/{rut}")
    ResponseEntity<ClientEntity> getClientByRut(@PathVariable("rut") String rut);

    // register a new client
    @PostMapping("/")
    ResponseEntity<ClientEntity> registerClient(@RequestBody ClientEntity client);

    // update client information
    @PutMapping("/")
    ResponseEntity<ClientEntity> updateClient(@RequestBody ClientEntity client);

    // delete a client by ID
    @DeleteMapping("/{id}")
    ResponseEntity<Boolean> deleteClientById(@PathVariable("id") Long id);
}