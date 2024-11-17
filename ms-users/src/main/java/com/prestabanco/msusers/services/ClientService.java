package com.prestabanco.msusers.services;

import com.prestabanco.msusers.entities.ClientEntity;
import com.prestabanco.msusers.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ClientService {
    @Autowired
    ClientRepository clientRepository;

    // Get all clients in ClientRepository
    public ArrayList<ClientEntity> getClients() {
        return (ArrayList<ClientEntity>) clientRepository.findAll();
    }

    // Save a client
    public ClientEntity saveClient(ClientEntity client) {
        return clientRepository.save(client);
    }

    // Get a client by id
    public ClientEntity getClientById(Long id) {
        return clientRepository.findById(id).get();
    }

    // get a client by Rut
    public ClientEntity getClientByRut(String rut) {
        return clientRepository.findByRut(rut);
    }
    public ClientEntity updateClient(ClientEntity client) {
        return clientRepository.save(client);
    }

    // delete a client by id
    public boolean deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client not found"); // Cambia Exception a RuntimeException si no está lanzando correctamente
        }
        clientRepository.deleteById(id);
        return true;
    }

}