package com.example.tesis_proyectosemilleros.dto.request;

import com.example.tesis_proyectosemilleros.model.EstadoContenido;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContenidoEducativoRequest {

    @NotBlank
    @Size(max = 250)
    private String titulo;

    @NotBlank
    @Size(max = 1500)
    private String resumen;

    @NotBlank
    private String cuerpo;

    @NotNull
    private EstadoContenido estado;

    /** Opcional: id del producto al que pertenece este contenido. */
    private Long productoId;

    /** Opcional: id de la categoria (cuando la subcategoria no es producto directo). */
    private Long categoriaId;
}
