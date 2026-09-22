package br.com.poupyg.fintechNovo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")



public class Controller {

    @GetMapping
    public String getHelloWorld(){
        return "Deu certo!";
    }
}

