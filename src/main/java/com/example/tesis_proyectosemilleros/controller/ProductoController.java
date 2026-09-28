package com.example.tesis_proyectosemilleros.controller;

import com.example.tesis_proyectosemilleros.dto.request.ProductoRequest;
import com.example.tesis_proyectosemilleros.dto.response.ProductoDetalleResponse;
import com.example.tesis_proyectosemilleros.dto.response.ProductoResponse;
import com.example.tesis_proyectosemilleros.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;

import java.util.List;

/**
 * Endpoints de Productos.
 * Flujo principal: listar por categoria + detalle enriquecido (producto + contenido + fuentes).
 */
@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> listar() {
        return ResponseEntity.ok(productoService.listarTodos());
    }

    /** Listar productos por id de categoria (flujo "Productos Naturales"). */
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProductoResponse>> listarPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(productoService.listarPorCategoria(categoriaId));
    }

    /** Listar productos por slug de categoria (URLs amigables). */
    @GetMapping("/categoria/slug/{slug}")
    public ResponseEntity<List<ProductoResponse>> listarPorSlugCategoria(@PathVariable String slug) {
        return ResponseEntity.ok(productoService.listarPorSlugCategoria(slug));
    }

    /** Detalle enriquecido: producto + contenido educativo + fuentes cientificas. */
    @GetMapping("/{id}/detalle")
    public ResponseEntity<ProductoDetalleResponse> detalle(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerDetalle(id));
    }

    // ========== CRUD ADMIN ==========

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(productoService.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable Long id,
                                                        @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
