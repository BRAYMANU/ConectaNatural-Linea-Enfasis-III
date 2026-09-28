package com.example.tesis_proyectosemilleros.repository;

import com.example.tesis_proyectosemilleros.model.ContenidoEducativo;
import com.example.tesis_proyectosemilleros.model.EstadoContenido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContenidoEducativoRepository extends JpaRepository<ContenidoEducativo, Long> {

    /** Primer contenido publicado de un producto (flujo de detalle de producto). */
    Optional<ContenidoEducativo> findFirstByProductoIdAndEstado(Long productoId, EstadoContenido estado);

    /** Primer contenido publicado de una categoria (flujo de detalle de subcategoria). */
    Optional<ContenidoEducativo> findFirstByCategoriaIdAndEstado(Long categoriaId, EstadoContenido estado);

    List<ContenidoEducativo> findByEstado(EstadoContenido estado);

    List<ContenidoEducativo> findByAutorId(Long autorId);
}
