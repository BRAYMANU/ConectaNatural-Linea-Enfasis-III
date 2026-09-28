package com.example.tesis_proyectosemilleros.service;

import com.example.tesis_proyectosemilleros.dto.request.ProductoRequest;
import com.example.tesis_proyectosemilleros.dto.response.ContenidoEducativoResponse;
import com.example.tesis_proyectosemilleros.dto.response.ProductoDetalleResponse;
import com.example.tesis_proyectosemilleros.dto.response.ProductoResponse;
import com.example.tesis_proyectosemilleros.exception.ResourceNotFoundException;
import com.example.tesis_proyectosemilleros.model.Categoria;
import com.example.tesis_proyectosemilleros.model.EstadoContenido;
import com.example.tesis_proyectosemilleros.model.Producto;
import com.example.tesis_proyectosemilleros.repository.CategoriaRepository;
import com.example.tesis_proyectosemilleros.repository.ContenidoEducativoRepository;
import com.example.tesis_proyectosemilleros.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ContenidoEducativoRepository contenidoRepository;
    private final ContenidoEducativoService contenidoService;

    public ProductoResponse crear(ProductoRequest request) {
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", request.getCategoriaId()));

        Producto p = Producto.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .imagenUrl(request.getImagenUrl())
                .categoria(categoria)
                .build();
        return toResponse(productoRepository.save(p));
    }

    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));

        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", request.getCategoriaId()));

        p.setNombre(request.getNombre());
        p.setDescripcion(request.getDescripcion());
        p.setImagenUrl(request.getImagenUrl());
        p.setCategoria(categoria);

        return toResponse(productoRepository.save(p));
    }

    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto", id);
        }
        productoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listarTodos() {
        return productoRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listarPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId).stream()
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listarPorSlugCategoria(String slug) {
        return productoRepository.findByCategoriaSlug(slug).stream()
                .map(this::toResponse).toList();
    }

    /**
     * Detalle enriquecido de un producto: producto + su contenido educativo + fuentes cientificas.
     * Este es el endpoint central del flujo "Productos Naturales" del frontend.
     */
    @Transactional(readOnly = true)
    public ProductoDetalleResponse obtenerDetalle(Long id) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));

        ContenidoEducativoResponse contenido = contenidoRepository
                .findFirstByProductoIdAndEstado(id, EstadoContenido.PUBLICADO)
                .map(contenidoService::toResponse)
                .orElse(null);

        return ProductoDetalleResponse.builder()
                .producto(toResponse(p))
                .contenido(contenido)
                .build();
    }

    // ========== mapper ==========

    public ProductoResponse toResponse(Producto p) {
        return ProductoResponse.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
                .imagenUrl(p.getImagenUrl())
                .categoriaId(p.getCategoria().getId())
                .categoriaNombre(p.getCategoria().getNombre())
                .build();
    }
}
