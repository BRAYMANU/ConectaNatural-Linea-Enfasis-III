package com.example.tesis_proyectosemilleros.repository;

import com.example.tesis_proyectosemilleros.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    /** Categorias raiz (sin padre) - las 4 principales. */
    List<Categoria> findByCategoriaPadreIsNull();

    /** Subcategorias de una categoria padre. */
    List<Categoria> findByCategoriaPadreId(Long padreId);

    Optional<Categoria> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
