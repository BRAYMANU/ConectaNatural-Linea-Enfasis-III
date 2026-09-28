package com.example.tesis_proyectosemilleros.exception;

/**
 * Excepcion para violaciones de reglas de negocio (ej. email duplicado).
 */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
