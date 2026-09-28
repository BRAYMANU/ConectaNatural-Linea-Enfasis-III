package com.example.tesis_proyectosemilleros.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Producto - capa de modelo.
 * Un producto natural siempre pertenece a una categoria.
 * Tiene asociado ContenidoEducativo con el resumen cientifico.
 */
@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    @Column(length = 500)
    private String imagenUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id",
                nullable = false,
                foreignKey = @ForeignKey(name = "fk_producto_categoria"))
    private Categoria categoria;

    @OneToMany(mappedBy = "producto", fetch = FetchType.LAZY)
    @Builder.Default
    private List<ContenidoEducativo> contenidos = new ArrayList<>();
}
