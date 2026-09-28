package com.example.tesis_proyectosemilleros.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FuenteCientificaResponse {
    private Long id;
    private String tituloArticulo;
    private String autores;
    private String revista;
    private Integer anioPublicacion;
    private String doi;
    private String url;
    private Long contenidoId;
}
