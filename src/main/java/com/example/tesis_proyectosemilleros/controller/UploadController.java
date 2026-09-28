package com.example.tesis_proyectosemilleros.controller;

import com.example.tesis_proyectosemilleros.exception.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Endpoint para subir archivos (imagenes de productos por ahora).
 * Solo ADMIN puede subir. Los archivos se guardan en {app.upload.dir}
 * y se sirven publicamente desde /uploads/**.
 */
@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

    private static final long MAX_BYTES = 5L * 1024 * 1024; // 5 MB
    private static final Set<String> EXT_PERMITIDAS = Set.of(".jpg", ".jpeg", ".png", ".webp", ".gif");

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping(value = "/imagen", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> subirImagen(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new BusinessException("El archivo esta vacio.");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new BusinessException("La imagen supera el tamanio maximo (5 MB).");
        }
        String ct = file.getContentType();
        if (ct == null || !ct.startsWith("image/")) {
            throw new BusinessException("Solo se permiten archivos de imagen.");
        }

        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf(".")).toLowerCase();
        }
        if (!EXT_PERMITIDAS.contains(ext)) {
            throw new BusinessException("Extension no permitida. Usa: " + EXT_PERMITIDAS);
        }

        String filename = UUID.randomUUID() + ext;
        Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(dir);
        Path destino = dir.resolve(filename);
        file.transferTo(destino.toFile());

        // Construye URL absoluta (ej. http://localhost:8080/uploads/abc.jpg)
        String baseUrl = request.getScheme() + "://" + request.getServerName()
                + (request.getServerPort() == 80 || request.getServerPort() == 443
                        ? "" : ":" + request.getServerPort());
        String url = baseUrl + "/uploads/" + filename;

        return ResponseEntity.ok(Map.of(
                "url", url,
                "filename", filename,
                "size", String.valueOf(file.getSize())
        ));
    }
}
