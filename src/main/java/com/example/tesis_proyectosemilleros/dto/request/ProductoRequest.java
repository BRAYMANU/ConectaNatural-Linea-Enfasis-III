package com.example.tesis_proyectosemilleros.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductoRequest {

    @NotBlank
    @Size(max = 180)
    private String nombre;

    @Size(max = 1000)
    private String descripcion;

    @Size(max = 500)
    private String imagenUrl;

    @NotNull(message = "La categoria es obligatoria")
    private Long categoriaId;
}
