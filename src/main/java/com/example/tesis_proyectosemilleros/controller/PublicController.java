package com.example.tesis_proyectosemilleros.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Endpoints publicos (sin autenticacion) para la landing page y health check.
 */
@RestController
@RequestMapping("/api/public")
public class PublicController {

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "service", "ConectaNatural API",
                "timestamp", LocalDateTime.now());
    }
}
