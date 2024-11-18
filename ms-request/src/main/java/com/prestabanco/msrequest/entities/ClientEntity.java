package com.prestabanco.msrequest.entities;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientEntity {
    private Long id;
    private String rut;
    private String name;
    private int age;
    private Long salary;
    private String email;
}