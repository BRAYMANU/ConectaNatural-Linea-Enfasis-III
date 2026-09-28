package com.example.tesis_proyectosemilleros.service;

import com.example.tesis_proyectosemilleros.dto.request.CategoriaRequest;
import com.example.tesis_proyectosemilleros.dto.response.CategoriaResponse;
import com.example.tesis_proyectosemilleros.exception.BusinessException;
import com.example.tesis_proyectosemilleros.exception.ResourceNotFoundException;
import com.example.tesis_proyectosemilleros.model.Categoria;
import com.example.tesis_proyectosemilleros.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaResponse crear(CategoriaRequest request) {
        if (categoriaRepository.existsBySlug(request.getSlug())) {
            throw new BusinessException("Ya existe una categoria con slug: " + request.getSlug());
        }

        Categoria padre = null;
        if (request.getCategoriaPadreId() != null) {
            padre = categoriaRepository.findById(request.getCategoriaPadreId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Categoria padre", request.getCategoriaPadreId()));
        }

        Categoria c = Categoria.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .slug(request.getSlug())
                .categoriaPadre(padre)
                .build();
        return toResponseSinSub(categoriaRepository.save(c));
    }

    public CategoriaResponse actualizar(Long id, CategoriaRequest request) {
        Categoria c = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));

        if (!c.getSlug().equals(request.getSlug())
                && categoriaRepository.existsBySlug(request.getSlug())) {
            throw new BusinessException("Ya existe una categoria con slug: " + request.getSlug());
        }

        c.setNombre(request.getNombre());
        c.setDescripcion(request.getDescripcion());
        c.setSlug(request.getSlug());

        if (request.getCategoriaPadreId() == null) {
            c.setCategoriaPadre(null);
        } else if (request.getCategoriaPadreId().equals(c.getId())) {
            throw new BusinessException("Una categoria no puede ser su propio padre");
        } else {
            Categoria padre = categoriaRepository.findById(request.getCategoriaPadreId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Categoria padre", request.getCategoriaPadreId()));
            c.setCategoriaPadre(padre);
        }

        return toResponseSinSub(categoriaRepository.save(c));
    }

    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoria", id);
        }
        categoriaRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarRaices() {
        return categoriaRepository.findByCategoriaPadreIsNull().stream()
                .map(this::toResponseConSub)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarSubcategorias(Long padreId) {
        if (!categoriaRepository.existsById(padreId)) {
            throw new ResourceNotFoundException("Categoria", padreId);
        }
        return categoriaRepository.findByCategoriaPadreId(padreId).stream()
                .map(this::toResponseSinSub)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponse obtenerPorId(Long id) {
        Categoria c = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));
        return toResponseConSub(c);
    }

    @Transactional(readOnly = true)
    public CategoriaResponse obtenerPorSlug(String slug) {
        Categoria c = categoriaRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria con slug '" + slug + "' no encontrada"));
        return toResponseConSub(c);
    }

    // ========== mappers ==========

    public CategoriaResponse toResponseSinSub(Categoria c) {
        return CategoriaResponse.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .descripcion(c.getDescripcion())
                .slug(c.getSlug())
                .categoriaPadreId(c.getCategoriaPadre() != null ? c.getCategoriaPadre().getId() : null)
                .categoriaPadreNombre(c.getCategoriaPadre() != null ? c.getCategoriaPadre().getNombre() : null)
                .build();
    }

    public CategoriaResponse toResponseConSub(Categoria c) {
        CategoriaResponse r = toResponseSinSub(c);
        r.setSubcategorias(c.getSubcategorias().stream()
                .map(this::toResponseSinSub)
                .toList());
        return r;
    }
}
