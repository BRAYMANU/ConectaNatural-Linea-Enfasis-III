package com.example.tesis_proyectosemilleros.service;

import com.example.tesis_proyectosemilleros.dto.auth.AuthResponse;
import com.example.tesis_proyectosemilleros.dto.auth.LoginRequest;
import com.example.tesis_proyectosemilleros.dto.auth.RegisterRequest;
import com.example.tesis_proyectosemilleros.exception.BusinessException;
import com.example.tesis_proyectosemilleros.model.Rol;
import com.example.tesis_proyectosemilleros.model.Usuario;
import com.example.tesis_proyectosemilleros.repository.UsuarioRepository;
import com.example.tesis_proyectosemilleros.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Servicio de autenticacion.
 * - register: crea usuarios con rol USER siempre.
 * - login: valida credenciales y genera JWT.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("El email ya esta registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Rol.USER)
                .activo(Boolean.TRUE)
                .build();

        usuarioRepository.save(usuario);

        return generarAuthResponse(usuario);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new BusinessException("Cuenta de usuario inactiva");
        }

        return generarAuthResponse(usuario);
    }

    private AuthResponse generarAuthResponse(Usuario usuario) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("rol", usuario.getRol().name());
        extraClaims.put("userId", usuario.getId());

        String token = jwtService.generateToken(extraClaims, usuario);

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .build();
    }
}
