package com.prestabanco.mstracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class MsTrackingApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsTrackingApplication.class, args);
	}

}
