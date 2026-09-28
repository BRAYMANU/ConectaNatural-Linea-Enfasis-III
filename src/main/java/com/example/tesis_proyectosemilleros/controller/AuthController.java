package com.example.tesis_proyectosemilleros.controller;

import com.example.tesis_proyectosemilleros.dto.auth.AuthResponse;
import com.example.tesis_proyectosemilleros.dto.auth.LoginRequest;
import com.example.tesis_proyectosemilleros.dto.auth.RegisterRequest;
import com.example.tesis_proyectosemilleros.dto.response.UsuarioResponse;
import com.example.tesis_proyectosemilleros.model.Usuario;
import com.example.tesis_proyectosemilleros.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints publicos de autenticacion.
 * POST /api/auth/register  -> registro publico (rol USER)
 * POST /api/auth/login     -> login por email + password
 * GET  /api/auth/me        -> usuario autenticado actual (requiere token)
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(UsuarioResponse.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .activo(usuario.getActivo())
                .fechaCreacion(usuario.getFechaCreacion())
                .build());
    }
}
