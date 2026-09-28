package com.example.tesis_proyectosemilleros.service;

import com.example.tesis_proyectosemilleros.dto.request.ContenidoEducativoRequest;
import com.example.tesis_proyectosemilleros.dto.response.ContenidoEducativoResponse;
import com.example.tesis_proyectosemilleros.dto.response.FuenteCientificaResponse;
import com.example.tesis_proyectosemilleros.dto.response.SubcategoriaDetalleResponse;
import com.example.tesis_proyectosemilleros.exception.BusinessException;
import com.example.tesis_proyectosemilleros.exception.ResourceNotFoundException;
import com.example.tesis_proyectosemilleros.model.*;
import com.example.tesis_proyectosemilleros.repository.CategoriaRepository;
import com.example.tesis_proyectosemilleros.repository.ContenidoEducativoRepository;
import com.example.tesis_proyectosemilleros.repository.ProductoRepository;
import com.example.tesis_proyectosemilleros.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ContenidoEducativoService {

    private final ContenidoEducativoRepository contenidoRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaService categoriaService;

    public ContenidoEducativoResponse crear(ContenidoEducativoRequest request) {
        validarAsociacion(request);

        Producto producto = null;
        if (request.getProductoId() != null) {
            producto = productoRepository.findById(request.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto", request.getProductoId()));
        }

        Categoria categoria = null;
        if (request.getCategoriaId() != null) {
            categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria", request.getCategoriaId()));
        }

        Usuario autor = obtenerAutorAutenticado();

        ContenidoEducativo c = ContenidoEducativo.builder()
                .titulo(request.getTitulo())
                .resumen(request.getResumen())
                .cuerpo(request.getCuerpo())
                .estado(request.getEstado())
                .producto(producto)
                .categoria(categoria)
                .autor(autor)
                .fechaPublicacion(request.getEstado() == EstadoContenido.PUBLICADO
                        ? LocalDateTime.now() : null)
                .build();

        return toResponse(contenidoRepository.save(c));
    }

    public ContenidoEducativoResponse actualizar(Long id, ContenidoEducativoRequest request) {
        validarAsociacion(request);

        ContenidoEducativo c = contenidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contenido", id));

        c.setTitulo(request.getTitulo());
        c.setResumen(request.getResumen());
        c.setCuerpo(request.getCuerpo());

        EstadoContenido anterior = c.getEstado();
        c.setEstado(request.getEstado());

        // Si pasa de BORRADOR a PUBLICADO, setea fecha
        if (anterior != EstadoContenido.PUBLICADO
                && request.getEstado() == EstadoContenido.PUBLICADO) {
            c.setFechaPublicacion(LocalDateTime.now());
        }

        if (request.getProductoId() != null) {
            c.setProducto(productoRepository.findById(request.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto", request.getProductoId())));
        } else {
            c.setProducto(null);
        }

        if (request.getCategoriaId() != null) {
            c.setCategoria(categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria", request.getCategoriaId())));
        } else {
            c.setCategoria(null);
        }

        return toResponse(contenidoRepository.save(c));
    }

    public void eliminar(Long id) {
        if (!contenidoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contenido", id);
        }
        contenidoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ContenidoEducativoResponse> listarTodos() {
        return contenidoRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ContenidoEducativoResponse> listarPublicados() {
        return contenidoRepository.findByEstado(EstadoContenido.PUBLICADO).stream()
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ContenidoEducativoResponse obtenerPorId(Long id) {
        return contenidoRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Contenido", id));
    }

    /**
     * Detalle de una subcategoria: categoria + contenido educativo + fuentes.
     * Usado por los flujos de Nutricion, Terapias y Precauciones.
     */
    @Transactional(readOnly = true)
    public SubcategoriaDetalleResponse obtenerDetalleSubcategoria(Long categoriaId) {
        Categoria c = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", categoriaId));

        ContenidoEducativoResponse contenido = contenidoRepository
                .findFirstByCategoriaIdAndEstado(categoriaId, EstadoContenido.PUBLICADO)
                .map(this::toResponse)
                .orElse(null);

        return SubcategoriaDetalleResponse.builder()
                .categoria(categoriaService.toResponseSinSub(c))
                .contenido(contenido)
                .build();
    }

    // ========== helpers ==========

    private void validarAsociacion(ContenidoEducativoRequest request) {
        if (request.getProductoId() == null && request.getCategoriaId() == null) {
            throw new BusinessException(
                    "El contenido debe estar asociado a un producto o a una categoria");
        }
    }

    private Usuario obtenerAutorAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BusinessException("Usuario no autenticado");
        }
        String email = auth.getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Autor no encontrado"));
    }

    public ContenidoEducativoResponse toResponse(ContenidoEducativo c) {
        List<FuenteCientificaResponse> fuentes = c.getFuentes() == null ? List.of()
                : c.getFuentes().stream()
                    .map(f -> FuenteCientificaResponse.builder()
                            .id(f.getId())
                            .tituloArticulo(f.getTituloArticulo())
                            .autores(f.getAutores())
                            .revista(f.getRevista())
                            .anioPublicacion(f.getAnioPublicacion())
                            .doi(f.getDoi())
                            .url(f.getUrl())
                            .contenidoId(c.getId())
                            .build())
                    .toList();

        return ContenidoEducativoResponse.builder()
                .id(c.getId())
                .titulo(c.getTitulo())
                .resumen(c.getResumen())
                .cuerpo(c.getCuerpo())
                .fechaPublicacion(c.getFechaPublicacion())
                .estado(c.getEstado().name())
                .productoId(c.getProducto() != null ? c.getProducto().getId() : null)
                .categoriaId(c.getCategoria() != null ? c.getCategoria().getId() : null)
                .autorId(c.getAutor().getId())
                .autorNombre(c.getAutor().getNombre())
                .fuentes(fuentes)
                .build();
    }
}
