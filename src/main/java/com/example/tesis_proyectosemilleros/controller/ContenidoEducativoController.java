package com.example.tesis_proyectosemilleros.controller;

import com.example.tesis_proyectosemilleros.dto.request.ContenidoEducativoRequest;
import com.example.tesis_proyectosemilleros.dto.response.ContenidoEducativoResponse;
import com.example.tesis_proyectosemilleros.service.ContenidoEducativoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contenidos")
@RequiredArgsConstructor
public class ContenidoEducativoController {

    private final ContenidoEducativoService contenidoService;

    @GetMapping("/publicados")
    public ResponseEntity<List<ContenidoEducativoResponse>> listarPublicados() {
        return ResponseEntity.ok(contenidoService.listarPublicados());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContenidoEducativoResponse>> listarTodos() {
        return ResponseEntity.ok(contenidoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContenidoEducativoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(contenidoService.obtenerPorId(id));
    }

    // ========== CRUD ADMIN ==========

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContenidoEducativoResponse> crear(
            @Valid @RequestBody ContenidoEducativoRequest request) {
        return ResponseEntity.ok(contenidoService.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContenidoEducativoResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ContenidoEducativoRequest request) {
        return ResponseEntity.ok(contenidoService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        contenidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
