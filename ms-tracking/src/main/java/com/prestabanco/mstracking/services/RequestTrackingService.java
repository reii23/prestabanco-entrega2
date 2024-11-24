package com.prestabanco.mstracking.services;

import com.prestabanco.mstracking.clients.RequestFeignClient;
import com.prestabanco.mstracking.entities.CreditRequestEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RequestTrackingService {

    @Autowired
    private RequestFeignClient requestFeignClient;

   // get requests by state
    public List<CreditRequestEntity> getRequestsByState(String status) {
        return requestFeignClient.getCreditRequestByStatus(status).getBody();
    }

    // get request by ID
    public Optional<CreditRequestEntity> getRequestById(Long id) {
        CreditRequestEntity creditRequest = requestFeignClient.getCreditRequestById(id).getBody();
        return Optional.ofNullable(creditRequest);
    }
}
