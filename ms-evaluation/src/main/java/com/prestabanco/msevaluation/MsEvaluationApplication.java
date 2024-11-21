package com.prestabanco.msevaluation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsEvaluationApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsEvaluationApplication.class, args);
	}

}
