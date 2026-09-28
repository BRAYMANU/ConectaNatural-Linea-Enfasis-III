package com.example.tesis_proyectosemilleros.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private String slug;
    private Long categoriaPadreId;
    private String categoriaPadreNombre;
    private List<CategoriaResponse> subcategorias;
}
