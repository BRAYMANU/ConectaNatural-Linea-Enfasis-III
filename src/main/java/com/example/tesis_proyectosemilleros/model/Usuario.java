package com.example.tesis_proyectosemilleros.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Entidad Usuario - capa de modelo.
 * Implementa UserDetails de Spring Security para integrarse con el flujo de autenticacion.
 */
@Entity
@Table(name = "usuarios",
       uniqueConstraints = @UniqueConstraint(name = "uk_usuario_email", columnNames = "email"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    @Column(nullable = false)
    private Boolean activo;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
        if (activo == null) {
            activo = Boolean.TRUE;
        }
        if (rol == null) {
            rol = Rol.USER;
        }
    }

    // ========== Implementacion de UserDetails ==========

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return Boolean.TRUE.equals(activo);
    }

    @Override
    public boolean isAccountNonLocked() {
        return Boolean.TRUE.equals(activo);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return Boolean.TRUE.equals(activo);
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(activo);
    }
}
