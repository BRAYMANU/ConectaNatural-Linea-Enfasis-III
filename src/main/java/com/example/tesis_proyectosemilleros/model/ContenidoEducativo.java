package com.example.tesis_proyectosemilleros.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad ContenidoEducativo - capa de modelo.
 * Representa el articulo cientifico resumido por el admin.
 * Puede estar asociado a un Producto (detalle de producto) O a una Categoria
 * (cuando es una subcategoria que no es producto, ej. "Respiracion consciente").
 * Regla de negocio: al menos uno de producto_id o categoria_id debe estar presente.
 */
@Entity
@Table(name = "contenidos_educativos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContenidoEducativo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 250)
    private String titulo;

    @Column(nullable = false, length = 1500)
    private String resumen;

    @Lob
    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String cuerpo;

    @Column(name = "fecha_publicacion")
    private LocalDateTime fechaPublicacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoContenido estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id",
                foreignKey = @ForeignKey(name = "fk_contenido_producto"))
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id",
                foreignKey = @ForeignKey(name = "fk_contenido_categoria"))
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "autor_id",
                nullable = false,
                foreignKey = @ForeignKey(name = "fk_contenido_autor"))
    private Usuario autor;

    @OneToMany(mappedBy = "contenido", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FuenteCientifica> fuentes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (estado == null) {
            estado = EstadoContenido.BORRADOR;
        }
        if (estado == EstadoContenido.PUBLICADO && fechaPublicacion == null) {
            fechaPublicacion = LocalDateTime.now();
        }
    }
}
