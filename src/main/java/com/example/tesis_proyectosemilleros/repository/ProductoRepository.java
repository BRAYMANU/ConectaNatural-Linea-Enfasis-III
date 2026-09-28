package com.example.tesis_proyectosemilleros.repository;

import com.example.tesis_proyectosemilleros.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /** Todos los productos de una categoria - usado por el flujo de Productos Naturales. */
    List<Producto> findByCategoriaId(Long categoriaId);

    /** Productos de una categoria por slug, para URLs amigables. */
    List<Producto> findByCategoriaSlug(String slug);
}
