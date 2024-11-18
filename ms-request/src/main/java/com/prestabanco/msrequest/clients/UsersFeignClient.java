package com.prestabanco.msrequest.clients;

import com.prestabanco.msrequest.configurations.FeignClientConfig;
import com.prestabanco.msrequest.entities.ClientEntity;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(value = "ms-users", path = "/api/v1/users", configuration = {FeignClientConfig.class})
public interface UsersFeignClient {

    // Get all clients
    @GetMapping("/")
    ResponseEntity<List<ClientEntity>> getAllClients();

    // Get a client by ID
    @GetMapping("/{id}")
    ResponseEntity<ClientEntity> getClientById(@PathVariable("id") Long id);

    // Get a client by RUT
    @GetMapping("/rut/{rut}")
    ResponseEntity<ClientEntity> getClientByRut(@PathVariable("rut") String rut);

    // Register a new client
    @PostMapping("/")
    ResponseEntity<ClientEntity> registerClient(@RequestBody ClientEntity client);

    // Update client information
    @PutMapping("/")
    ResponseEntity<ClientEntity> updateClient(@RequestBody ClientEntity client);

    // Delete a client by ID
    @DeleteMapping("/{id}")
    ResponseEntity<Boolean> deleteClientById(@PathVariable("id") Long id);
}
