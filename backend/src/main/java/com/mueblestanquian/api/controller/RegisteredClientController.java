package com.mueblestanquian.api.controller;

import com.mueblestanquian.api.model.RegisteredClientEntity;
import com.mueblestanquian.api.repository.RegisteredClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
public class RegisteredClientController {
    @Autowired
    private RegisteredClientRepository registeredClientRepository;

    @PostMapping
    public ResponseEntity<?> registerClient(@RequestBody RegisteredClientEntity client) {
        try {
            if (client.getId() == null || client.getId().isEmpty()) {
                client.setId(java.util.UUID.randomUUID().toString());
            }

            // if (client.getRedirectUris() == null || client.getRedirectUris().isEmpty()) {
            //     client.setRedirectUris("http://localhost:8080/callback");
            // }

            System.out.println(client.toString());
            
            RegisteredClientEntity saved = registeredClientRepository.save(client);
            return ResponseEntity.ok(client);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al registrar cliente: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllClients() {
        try {
            java.util.List<RegisteredClientEntity> clients = registeredClientRepository.findAll();
            return ResponseEntity.ok(clients);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al consultar clientes: " + e.getMessage());
        }
    }
}
