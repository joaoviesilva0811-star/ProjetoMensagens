<?php
// ==============================================
//  api.php — Endpoint AJAX (POST / GET)
// ==============================================

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/config.php';

// ── helpers ────────────────────────────────────
function json_out(bool $ok, string $msg, array $extra = []): void {
    echo json_encode(array_merge(['ok' => $ok, 'message' => $msg], $extra));
    exit;
}

// ── GET: lista registros ────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $pdo  = getConnection();
        $stmt = $pdo->query('SELECT id, nome, email, mensagem, criado_em FROM registros ORDER BY id DESC');
        $rows = $stmt->fetchAll();
        json_out(true, 'ok', ['data' => $rows]);
    } catch (PDOException $e) {
        json_out(false, 'Erro ao consultar o banco de dados.');
    }
}

// ── POST: insere novo registro ──────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 1. Lê e sanitiza
    $nome     = trim(filter_input(INPUT_POST, 'nome',     FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
    $email    = trim(filter_input(INPUT_POST, 'email',    FILTER_SANITIZE_EMAIL)         ?? '');
    $senha    = trim($_POST['senha']    ?? '');
    $mensagem = trim(filter_input(INPUT_POST, 'mensagem', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');

    $errors = [];

    // 2. Validações
    if ($nome === '' || mb_strlen($nome) < 2) {
        $errors['nome'] = 'O nome deve ter pelo menos 2 caracteres.';
    }

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Informe um e-mail válido.';
    } elseif (!preg_match('/@gmail\.com$/i', $email)) {
        $errors['email'] = 'Apenas e-mails @gmail.com são aceitos neste sistema.';
    }

    if ($senha === '' || mb_strlen($senha) < 6) {
        $errors['senha'] = 'A senha deve ter pelo menos 6 caracteres.';
    }

    if ($mensagem === '') {
        $errors['mensagem'] = 'A mensagem não pode estar vazia.';
    } elseif (mb_strlen($mensagem) > 250) {
        $errors['mensagem'] = 'A mensagem deve ter no máximo 250 caracteres.';
    }

    if (!empty($errors)) {
        json_out(false, 'Corrija os erros abaixo.', ['errors' => $errors]);
    }

    // 3. Hash da senha
    $senhaHash = password_hash($senha, PASSWORD_BCRYPT);

    // 4. Persiste com prepared statement
    try {
        $pdo  = getConnection();
        $stmt = $pdo->prepare(
            'INSERT INTO registros (nome, email, senha, mensagem) VALUES (:nome, :email, :senha, :mensagem)'
        );
        $stmt->execute([
            ':nome'     => $nome,
            ':email'    => $email,
            ':senha'    => $senhaHash,
            ':mensagem' => $mensagem,
        ]);
        json_out(true, 'Registro salvo com sucesso!');
    } catch (PDOException $e) {
        json_out(false, 'Erro ao salvar no banco de dados. Tente novamente.');
    }
}

// Método não suportado
http_response_code(405);
json_out(false, 'Método não permitido.');
