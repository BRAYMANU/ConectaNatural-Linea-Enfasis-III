package com.example.tesis_proyectosemilleros.service;

import com.example.tesis_proyectosemilleros.dto.auth.AdminCreateUserRequest;
import com.example.tesis_proyectosemilleros.dto.response.UsuarioResponse;
import com.example.tesis_proyectosemilleros.exception.BusinessException;
import com.example.tesis_proyectosemilleros.exception.ResourceNotFoundException;
import com.example.tesis_proyectosemilleros.model.Usuario;
import com.example.tesis_proyectosemilleros.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio para gestion de usuarios.
 * Solo los ADMIN pueden crear otros usuarios (incluidos otros ADMIN).
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioResponse crearPorAdmin(AdminCreateUserRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("El email ya esta registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(request.getRol())
                .activo(Boolean.TRUE)
                .build();

        usuario = usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
    }

    public UsuarioResponse cambiarEstado(Long id, boolean activo) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        u.setActivo(activo);
        return toResponse(usuarioRepository.save(u));
    }

    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario", id);
        }
        usuarioRepository.deleteById(id);
    }

    private UsuarioResponse toResponse(Usuario u) {
        return UsuarioResponse.builder()
                .id(u.getId())
                .nombre(u.getNombre())
                .email(u.getEmail())
                .rol(u.getRol().name())
                .activo(u.getActivo())
                .fechaCreacion(u.getFechaCreacion())
                .build();
    }
}
