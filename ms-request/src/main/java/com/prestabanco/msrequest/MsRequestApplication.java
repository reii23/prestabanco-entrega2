package com.prestabanco.msrequest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsRequestApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsRequestApplication.class, args);
	}

}
