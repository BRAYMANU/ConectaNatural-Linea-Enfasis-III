package com.example.tesis_proyectosemilleros.dto.auth;

import com.example.tesis_proyectosemilleros.model.Rol;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Payload usado solo por ADMIN para crear otros usuarios (incluidos otros ADMIN).
 */
@Data
public class AdminCreateUserRequest {

    @NotBlank
    @Size(min = 2, max = 120)
    private String nombre;

    @NotBlank
    @Email
    @Size(max = 180)
    private String email;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    @NotNull(message = "El rol es obligatorio")
    private Rol rol;
}
