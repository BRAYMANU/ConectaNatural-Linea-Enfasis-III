package com.example.tesis_proyectosemilleros.controller;

import com.example.tesis_proyectosemilleros.dto.auth.AdminCreateUserRequest;
import com.example.tesis_proyectosemilleros.dto.response.UsuarioResponse;
import com.example.tesis_proyectosemilleros.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints ADMIN-only para gestion de usuarios.
 * Solo un ADMIN puede crear otros ADMIN (o USER).
 */
@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponse> crear(@Valid @RequestBody AdminCreateUserRequest request) {
        return ResponseEntity.ok(usuarioService.crearPorAdmin(request));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<UsuarioResponse> cambiarEstado(@PathVariable Long id,
                                                        @RequestParam boolean activo) {
        return ResponseEntity.ok(usuarioService.cambiarEstado(id, activo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
