package com.example.tesis_proyectosemilleros.controller;

import com.example.tesis_proyectosemilleros.dto.request.FuenteCientificaRequest;
import com.example.tesis_proyectosemilleros.dto.response.FuenteCientificaResponse;
import com.example.tesis_proyectosemilleros.service.FuenteCientificaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuentes")
@RequiredArgsConstructor
public class FuenteCientificaController {

    private final FuenteCientificaService fuenteService;

    @GetMapping
    public ResponseEntity<List<FuenteCientificaResponse>> listar() {
        return ResponseEntity.ok(fuenteService.listarTodas());
    }

    @GetMapping("/contenido/{contenidoId}")
    public ResponseEntity<List<FuenteCientificaResponse>> listarPorContenido(
            @PathVariable Long contenidoId) {
        return ResponseEntity.ok(fuenteService.listarPorContenido(contenidoId));
    }

    // ========== CRUD ADMIN ==========

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FuenteCientificaResponse> crear(
            @Valid @RequestBody FuenteCientificaRequest request) {
        return ResponseEntity.ok(fuenteService.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FuenteCientificaResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody FuenteCientificaRequest request) {
        return ResponseEntity.ok(fuenteService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        fuenteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
