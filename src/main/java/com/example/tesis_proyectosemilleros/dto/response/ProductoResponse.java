package com.example.tesis_proyectosemilleros.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private String imagenUrl;
    private Long categoriaId;
    private String categoriaNombre;
}
