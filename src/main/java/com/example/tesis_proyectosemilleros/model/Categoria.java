package com.example.tesis_proyectosemilleros.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Categoria - capa de modelo.
 * Soporta jerarquia de subcategorias mediante auto-referencia (categoria_padre_id).
 * Las categorias raiz (padre = null) son las 4 principales:
 *  - Productos Naturales
 *  - Nutricion
 *  - Terapias
 *  - Precauciones
 * El campo slug permite al frontend consultar por nombre amigable en URL.
 */
@Entity
@Table(name = "categorias",
       uniqueConstraints = @UniqueConstraint(name = "uk_categoria_slug", columnNames = "slug"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false, length = 160)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_padre_id",
                foreignKey = @ForeignKey(name = "fk_categoria_padre"))
    private Categoria categoriaPadre;

    @OneToMany(mappedBy = "categoriaPadre", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Categoria> subcategorias = new ArrayList<>();

    @OneToMany(mappedBy = "categoria", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Producto> productos = new ArrayList<>();

    @OneToMany(mappedBy = "categoria", fetch = FetchType.LAZY)
    @Builder.Default
    private List<ContenidoEducativo> contenidos = new ArrayList<>();

    /** true si es categoria raiz (sin padre). */
    @Transient
    public boolean esRaiz() {
        return categoriaPadre == null;
    }
}
