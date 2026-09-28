package com.example.tesis_proyectosemilleros.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FuenteCientificaRequest {

    @NotBlank
    @Size(max = 300)
    private String tituloArticulo;

    @Size(max = 300)
    private String autores;

    @Size(max = 200)
    private String revista;

    private Integer anioPublicacion;

    @Size(max = 100)
    private String doi;

    @Size(max = 500)
    private String url;

    @NotNull(message = "El contenido asociado es obligatorio")
    private Long contenidoId;
}
