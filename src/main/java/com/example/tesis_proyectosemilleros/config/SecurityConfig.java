package com.example.tesis_proyectosemilleros.config;

import com.example.tesis_proyectosemilleros.security.CustomUserDetailsService;
import com.example.tesis_proyectosemilleros.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuracion de Spring Security.
 * - Stateless (JWT en header Authorization).
 * - CORS habilitado para el frontend React en dev.
 * - Rutas publicas: /api/auth/**, /api/public/**.
 * - Autorizacion por roles: ADMIN tiene CRUD total, USER solo lectura.
 */
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    // Publico: auth + health + archivos servidos
                    .requestMatchers("/api/auth/**", "/api/public/**", "/uploads/**").permitAll()
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    // Swagger / OpenAPI
                    .requestMatchers(
                            "/swagger-ui.html",
                            "/swagger-ui/**",
                            "/v3/api-docs/**"
                    ).permitAll()
                    // Lectura (USER o ADMIN)
                    .requestMatchers(HttpMethod.GET, "/api/categorias/**").hasAnyRole("USER", "ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/productos/**").hasAnyRole("USER", "ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/contenidos/**").hasAnyRole("USER", "ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/fuentes/**").hasAnyRole("USER", "ADMIN")
                    // Admin exclusivo: /api/admin/** + modificaciones
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/categorias/**", "/api/productos/**",
                            "/api/contenidos/**", "/api/fuentes/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/categorias/**", "/api/productos/**",
                            "/api/contenidos/**", "/api/fuentes/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/categorias/**", "/api/productos/**",
                            "/api/contenidos/**", "/api/fuentes/**").hasRole("ADMIN")
                    .anyRequest().authenticated())
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Usamos patrones para aceptar cualquier puerto en localhost (Vite a veces salta a 5174, 5175...)
        config.setAllowedOriginPatterns(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
