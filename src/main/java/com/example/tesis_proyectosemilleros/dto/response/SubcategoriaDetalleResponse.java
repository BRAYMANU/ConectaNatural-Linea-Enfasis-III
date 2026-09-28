package com.example.tesis_proyectosemilleros.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Respuesta enriquecida para el detalle de una subcategoria.
 * Usada por los flujos de Nutricion, Terapias y Precauciones:
 * al hacer clic en una subcategoria -> ver nombre + resumen del admin + fuentes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubcategoriaDetalleResponse {
    private CategoriaResponse categoria;
    private ContenidoEducativoResponse contenido;
}
