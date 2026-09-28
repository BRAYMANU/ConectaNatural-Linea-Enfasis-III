-- =====================================================
-- Script de creacion de base de datos ConectaNatural
-- Ejecutar UNA SOLA VEZ en SSMS antes de levantar Spring Boot.
-- Hibernate (ddl-auto=update) creara todas las tablas
-- automaticamente al arrancar la aplicacion por primera vez.
-- =====================================================

USE master;
GO

-- Si la base ya existe, no hacer nada (idempotente)
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'conectanatural_db')
BEGIN
    CREATE DATABASE conectanatural_db;
    PRINT 'Base de datos conectanatural_db creada correctamente.';
END
ELSE
BEGIN
    PRINT 'La base de datos conectanatural_db ya existe.';
END
GO

-- Verificar la creacion
USE conectanatural_db;
GO

PRINT '=================================================';
PRINT 'Base de datos lista. Ahora levanta Spring Boot';
PRINT 'y Hibernate creara las tablas automaticamente.';
PRINT '=================================================';
GO
