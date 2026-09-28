-- =====================================================
-- Base de datos independiente para la actividad
-- =====================================================

USE master;
GO

IF NOT EXISTS (
    SELECT name
    FROM sys.databases
    WHERE name = 'conectanatural_actividad_db'
)
BEGIN
    CREATE DATABASE conectanatural_actividad_db;
    PRINT 'Base de datos conectanatural_actividad_db creada correctamente.';
END
ELSE
BEGIN
    PRINT 'La base de datos conectanatural_actividad_db ya existe.';
END
GO

USE conectanatural_actividad_db;
GO

PRINT '=================================================';
PRINT 'Base de datos de actividad lista.';
PRINT 'Spring Boot creara las tablas automaticamente.';
PRINT '=================================================';
GO