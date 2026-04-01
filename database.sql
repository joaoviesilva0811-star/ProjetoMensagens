-- ==============================================
--  Script SQL - Sistema de Formulário
--  Execute este script no seu MySQL/MariaDB
-- ==============================================

CREATE DATABASE IF NOT EXISTS formulario_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE formulario_db;

CREATE TABLE IF NOT EXISTS registros (
    id        INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    nome      VARCHAR(120)    NOT NULL,
    email     VARCHAR(180)    NOT NULL,
    senha     VARCHAR(255)    NOT NULL,
    mensagem  VARCHAR(250)    NOT NULL,
    criado_em DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
