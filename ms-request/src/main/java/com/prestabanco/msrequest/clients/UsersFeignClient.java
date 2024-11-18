package com.prestabanco.msrequest.clients;

import com.prestabanco.msrequest.configurations.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(value = "ms-users", path = "/api/v1/users", configuration = {FeignClientConfig.class})
public interface UsersFeignClient {
    

}
