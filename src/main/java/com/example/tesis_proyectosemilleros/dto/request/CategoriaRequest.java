package com.example.tesis_proyectosemilleros.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoriaRequest {

    @NotBlank
    @Size(max = 150)
    private String nombre;

    @Size(max = 500)
    private String descripcion;

    @NotBlank
    @Size(max = 160)
    private String slug;

    /** null si es categoria raiz. */
    private Long categoriaPadreId;
}
