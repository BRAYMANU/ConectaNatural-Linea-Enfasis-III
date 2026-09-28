package com.example.tesis_proyectosemilleros.exception;

import com.example.tesis_proyectosemilleros.dto.response.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Manejador global de excepciones para toda la API.
 * Convierte excepciones en respuestas JSON consistentes.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex,
                                                            HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request, null);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiErrorResponse> handleBusiness(BusinessException ex,
                                                            HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request, null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex,
                                                              HttpServletRequest request) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(this::formatFieldError)
                .toList();
        return buildResponse(HttpStatus.BAD_REQUEST, "Errores de validacion", request, details);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException ex,
                                                                  HttpServletRequest request) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Credenciales invalidas", request, null);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuth(AuthenticationException ex,
                                                        HttpServletRequest request) {
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), request, null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex,
                                                                HttpServletRequest request) {
        return buildResponse(HttpStatus.FORBIDDEN,
                "Acceso denegado: no tienes permisos para esta operacion", request, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex,
                                                          HttpServletRequest request) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "Error inesperado: " + ex.getMessage(), request, null);
    }

    // ========== helpers ==========

    private String formatFieldError(FieldError fe) {
        return fe.getField() + ": " + fe.getDefaultMessage();
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(HttpStatus status,
                                                            String message,
                                                            HttpServletRequest request,
                                                            List<String> details) {
        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .details(details)
                .build();
        return ResponseEntity.status(status).body(body);
    }
}
