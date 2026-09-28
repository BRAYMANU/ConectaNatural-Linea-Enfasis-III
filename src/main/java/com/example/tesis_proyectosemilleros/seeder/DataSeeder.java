package com.example.tesis_proyectosemilleros.seeder;

import com.example.tesis_proyectosemilleros.model.Categoria;
import com.example.tesis_proyectosemilleros.model.Rol;
import com.example.tesis_proyectosemilleros.model.Usuario;
import com.example.tesis_proyectosemilleros.repository.CategoriaRepository;
import com.example.tesis_proyectosemilleros.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeder de datos iniciales.
 * Al primer arranque crea:
 *  - Usuario ADMIN por defecto (configurable via application.properties).
 *  - Las 4 categorias raiz: Productos Naturales, Nutricion, Terapias, Precauciones.
 * Idempotente: si ya existen no crea duplicados.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class  DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.nombre}")
    private String adminNombre;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCategoriasRaiz();
    }

    private void seedAdmin() {
        if (usuarioRepository.existsByEmail(adminEmail)) {
            log.info("Admin ya existe ({}). Saltando seed de admin.", adminEmail);
            return;
        }
        Usuario admin = Usuario.builder()
                .nombre(adminNombre)
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .rol(Rol.ADMIN)
                .activo(Boolean.TRUE)
                .build();
        usuarioRepository.save(admin);
        log.info("=================================================");
        log.info("Admin creado correctamente: {}", adminEmail);
        log.info("=================================================");
    }

    private void seedCategoriasRaiz() {
        List<CategoriaSeed> raices = List.of(
                new CategoriaSeed("Productos Naturales", "productos-naturales",
                        "Hierbas medicinales, suplementos y productos de origen natural con respaldo cientifico."),
                new CategoriaSeed("Nutricion", "nutricion",
                        "Informacion sobre alimentacion saludable, vitaminas y habitos alimenticios."),
                new CategoriaSeed("Terapias", "terapias",
                        "Terapias complementarias como meditacion, acupuntura, fitoterapia, masajes y yoga."),
                new CategoriaSeed("Precauciones", "precauciones",
                        "Contraindicaciones, interacciones y advertencias sobre el uso de medicina complementaria.")
        );

        for (CategoriaSeed seed : raices) {
            if (categoriaRepository.existsBySlug(seed.slug)) {
                log.debug("Categoria '{}' ya existe. Saltando.", seed.slug);
                continue;
            }
            Categoria c = Categoria.builder()
                    .nombre(seed.nombre)
                    .slug(seed.slug)
                    .descripcion(seed.descripcion)
                    .categoriaPadre(null)
                    .build();
            categoriaRepository.save(c);
            log.info("Categoria raiz creada: {}", seed.nombre);
        }
    }

    private record CategoriaSeed(String nombre, String slug, String descripcion) {}
}
