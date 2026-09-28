package com.example.tesis_proyectosemilleros.controller;

import com.example.tesis_proyectosemilleros.dto.request.CategoriaRequest;
import com.example.tesis_proyectosemilleros.dto.response.CategoriaResponse;
import com.example.tesis_proyectosemilleros.dto.response.SubcategoriaDetalleResponse;
import com.example.tesis_proyectosemilleros.service.CategoriaService;
import com.example.tesis_proyectosemilleros.service.ContenidoEducativoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints de Categorias.
 * GET: USER y ADMIN.
 * POST/PUT/DELETE: solo ADMIN (protegido por SecurityConfig + @PreAuthorize).
 */
@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;
    private final ContenidoEducativoService contenidoService;

    /** Listar categorias raiz (las 4 principales). */
    @GetMapping("/raices")
    public ResponseEntity<List<CategoriaResponse>> listarRaices() {
        return ResponseEntity.ok(categoriaService.listarRaices());
    }

    /** Listar todas las categorias (flujo admin). */
    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listarRaicesConSub() {
        return ResponseEntity.ok(categoriaService.listarRaices());
    }

    /** Subcategorias de un padre por id. */
    @GetMapping("/{padreId}/subcategorias")
    public ResponseEntity<List<CategoriaResponse>> subcategorias(@PathVariable Long padreId) {
        return ResponseEntity.ok(categoriaService.listarSubcategorias(padreId));
    }

    /** Obtener categoria por id (con sus subcategorias). */
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.obtenerPorId(id));
    }

    /** Obtener categoria por slug (URLs amigables). */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<CategoriaResponse> obtenerPorSlug(@PathVariable String slug) {
        return ResponseEntity.ok(categoriaService.obtenerPorSlug(slug));
    }

    /** Detalle de una subcategoria: categoria + contenido + fuentes. */
    @GetMapping("/{id}/detalle")
    public ResponseEntity<SubcategoriaDetalleResponse> detalleSubcategoria(@PathVariable Long id) {
        return ResponseEntity.ok(contenidoService.obtenerDetalleSubcategoria(id));
    }

    // ========== CRUD ADMIN ==========

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoriaResponse> crear(@Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoriaResponse> actualizar(@PathVariable Long id,
                                                        @Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
