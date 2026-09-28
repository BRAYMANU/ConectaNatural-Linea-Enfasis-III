package com.example.tesis_proyectosemilleros.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContenidoEducativoResponse {
    private Long id;
    private String titulo;
    private String resumen;
    private String cuerpo;
    private LocalDateTime fechaPublicacion;
    private String estado;
    private Long productoId;
    private Long categoriaId;
    private Long autorId;
    private String autorNombre;
    private List<FuenteCientificaResponse> fuentes;
}
