package com.example.tesis_proyectosemilleros.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad FuenteCientifica - capa de modelo.
 * Referencia bibliografica que respalda un ContenidoEducativo.
 * Esta entidad materializa el objetivo especifico 1 de la tesis:
 * investigar y seleccionar fuentes confiables de informacion cientifica.
 */
@Entity
@Table(name = "fuentes_cientificas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuenteCientifica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo_articulo", nullable = false, length = 300)
    private String tituloArticulo;

    @Column(length = 300)
    private String autores;

    @Column(length = 200)
    private String revista;

    @Column(name = "anio_publicacion")
    private Integer anioPublicacion;

    @Column(length = 100)
    private String doi;

    @Column(length = 500)
    private String url;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "contenido_id",
                nullable = false,
                foreignKey = @ForeignKey(name = "fk_fuente_contenido"))
    private ContenidoEducativo contenido;
}
