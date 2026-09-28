package com.example.tesis_proyectosemilleros.repository;

import com.example.tesis_proyectosemilleros.model.FuenteCientifica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FuenteCientificaRepository extends JpaRepository<FuenteCientifica, Long> {

    List<FuenteCientifica> findByContenidoId(Long contenidoId);
}
