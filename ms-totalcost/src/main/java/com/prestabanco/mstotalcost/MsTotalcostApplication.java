package com.prestabanco.mstotalcost;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class MsTotalcostApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsTotalcostApplication.class, args);
	}

}
