package com.example.tesis_proyectosemilleros.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Respuesta enriquecida para el detalle de un producto.
 * Incluye el contenido educativo asociado (con resumen y fuentes cientificas).
 * Usado por el flujo del frontend: seleccionar un producto -> ver su resumen + fuentes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDetalleResponse {
    private ProductoResponse producto;
    private ContenidoEducativoResponse contenido;
}
