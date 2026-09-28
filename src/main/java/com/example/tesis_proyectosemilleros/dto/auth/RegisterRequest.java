package com.example.tesis_proyectosemilleros.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Registro publico: solo crea usuarios con rol USER.
 * Para crear ADMIN debe llamarse a /api/admin/usuarios (protegido).
 */
@Data
public class RegisterRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 120, message = "El nombre debe tener entre 2 y 120 caracteres")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene formato valido")
    @Size(max = 180)
    private String email;

    @NotBlank(message = "La contrasena es obligatoria")
    @Size(min = 6, max = 100, message = "La contrasena debe tener entre 6 y 100 caracteres")
    private String password;
}
