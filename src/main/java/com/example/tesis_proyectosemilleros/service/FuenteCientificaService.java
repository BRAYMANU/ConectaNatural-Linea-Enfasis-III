package com.example.tesis_proyectosemilleros.service;

import com.example.tesis_proyectosemilleros.dto.request.FuenteCientificaRequest;
import com.example.tesis_proyectosemilleros.dto.response.FuenteCientificaResponse;
import com.example.tesis_proyectosemilleros.exception.ResourceNotFoundException;
import com.example.tesis_proyectosemilleros.model.ContenidoEducativo;
import com.example.tesis_proyectosemilleros.model.FuenteCientifica;
import com.example.tesis_proyectosemilleros.repository.ContenidoEducativoRepository;
import com.example.tesis_proyectosemilleros.repository.FuenteCientificaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FuenteCientificaService {

    private final FuenteCientificaRepository fuenteRepository;
    private final ContenidoEducativoRepository contenidoRepository;

    public FuenteCientificaResponse crear(FuenteCientificaRequest request) {
        ContenidoEducativo contenido = contenidoRepository.findById(request.getContenidoId())
                .orElseThrow(() -> new ResourceNotFoundException("Contenido", request.getContenidoId()));

        FuenteCientifica f = FuenteCientifica.builder()
                .tituloArticulo(request.getTituloArticulo())
                .autores(request.getAutores())
                .revista(request.getRevista())
                .anioPublicacion(request.getAnioPublicacion())
                .doi(request.getDoi())
                .url(request.getUrl())
                .contenido(contenido)
                .build();

        return toResponse(fuenteRepository.save(f));
    }

    public FuenteCientificaResponse actualizar(Long id, FuenteCientificaRequest request) {
        FuenteCientifica f = fuenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fuente cientifica", id));

        ContenidoEducativo contenido = contenidoRepository.findById(request.getContenidoId())
                .orElseThrow(() -> new ResourceNotFoundException("Contenido", request.getContenidoId()));

        f.setTituloArticulo(request.getTituloArticulo());
        f.setAutores(request.getAutores());
        f.setRevista(request.getRevista());
        f.setAnioPublicacion(request.getAnioPublicacion());
        f.setDoi(request.getDoi());
        f.setUrl(request.getUrl());
        f.setContenido(contenido);

        return toResponse(fuenteRepository.save(f));
    }

    public void eliminar(Long id) {
        if (!fuenteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Fuente cientifica", id);
        }
        fuenteRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<FuenteCientificaResponse> listarPorContenido(Long contenidoId) {
        return fuenteRepository.findByContenidoId(contenidoId).stream()
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<FuenteCientificaResponse> listarTodas() {
        return fuenteRepository.findAll().stream().map(this::toResponse).toList();
    }

    private FuenteCientificaResponse toResponse(FuenteCientifica f) {
        return FuenteCientificaResponse.builder()
                .id(f.getId())
                .tituloArticulo(f.getTituloArticulo())
                .autores(f.getAutores())
                .revista(f.getRevista())
                .anioPublicacion(f.getAnioPublicacion())
                .doi(f.getDoi())
                .url(f.getUrl())
                .contenidoId(f.getContenido().getId())
                .build();
    }
}
