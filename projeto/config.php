<?php
// ==============================================
//  config.php — Configuração do banco de dados
// ==============================================

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'formulario_db');
define('DB_USER', 'root');       // ← altere para o seu usuário
define('DB_PASS', '');           // ← altere para a sua senha

function getConnection(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            DB_HOST, DB_PORT, DB_NAME
        );
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    }
    return $pdo;
}
