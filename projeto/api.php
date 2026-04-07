<?php
// ==============================================
//  api.php — Endpoint AJAX (CRUD completo)
//  GET    → lista registros / busca por ID
//  POST   → insere novo registro
//  PUT    → atualiza registro existente
//  DELETE → remove registro
// ==============================================

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/config.php';

// ── helpers ────────────────────────────────────
function json_out(bool $ok, string $msg, array $extra = []): void {
    echo json_encode(array_merge(['ok' => $ok, 'message' => $msg], $extra));
    exit;
}

function sanitize_string(string $value): string {
    return trim(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'));
}

// ── GET: lista todos ou busca por ID ───────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
        if (!$id || $id <= 0) json_out(false, 'ID inválido.');
        try {
            $pdo  = getConnection();
            $stmt = $pdo->prepare('SELECT id, nome, email, mensagem, criado_em FROM registros WHERE id = :id');
            $stmt->execute([':id' => $id]);
            $row  = $stmt->fetch();
            if (!$row) json_out(false, 'Registro não encontrado.');
            json_out(true, 'ok', ['data' => $row]);
        } catch (PDOException $e) {
            json_out(false, 'Erro ao consultar o banco de dados.');
        }
    }
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
    $nome     = sanitize_string(filter_input(INPUT_POST, 'nome',     FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
    $email    = trim(filter_input(INPUT_POST, 'email',    FILTER_SANITIZE_EMAIL) ?? '');
    $senha    = trim($_POST['senha']    ?? '');
    $mensagem = sanitize_string(filter_input(INPUT_POST, 'mensagem', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');

    $errors = [];
    if ($nome === '' || mb_strlen($nome) < 2)
        $errors['nome'] = 'O nome deve ter pelo menos 2 caracteres.';
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL))
        $errors['email'] = 'Informe um e-mail válido.';
    elseif (!preg_match('/@gmail\.com$/i', $email))
        $errors['email'] = 'Apenas e-mails @gmail.com são aceitos neste sistema.';
    if ($senha === '' || mb_strlen($senha) < 6)
        $errors['senha'] = 'A senha deve ter pelo menos 6 caracteres.';
    if ($mensagem === '')
        $errors['mensagem'] = 'A mensagem não pode estar vazia.';
    elseif (mb_strlen($mensagem) > 250)
        $errors['mensagem'] = 'A mensagem deve ter no máximo 250 caracteres.';

    if (!empty($errors)) json_out(false, 'Corrija os erros abaixo.', ['errors' => $errors]);

    try {
        $pdo  = getConnection();
        $stmt = $pdo->prepare(
            'INSERT INTO registros (nome, email, senha, mensagem) VALUES (:nome, :email, :senha, :mensagem)'
        );
        $stmt->execute([
            ':nome'     => $nome,
            ':email'    => $email,
            ':senha'    => password_hash($senha, PASSWORD_BCRYPT),
            ':mensagem' => $mensagem,
        ]);
        json_out(true, 'Registro salvo com sucesso!', ['id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        json_out(false, 'Erro ao salvar no banco de dados. Tente novamente.');
    }
}

// ── PUT: atualiza registro existente ───────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $raw    = file_get_contents('php://input');
    $parsed = json_decode($raw, true);
    if (!$parsed) parse_str($raw, $parsed);

    $id       = filter_var($parsed['id']       ?? 0, FILTER_VALIDATE_INT);
    $nome     = sanitize_string($parsed['nome']     ?? '');
    $email    = trim($parsed['email']    ?? '');
    $mensagem = sanitize_string($parsed['mensagem'] ?? '');
    $senha    = trim($parsed['senha']    ?? '');

    if (!$id || $id <= 0) json_out(false, 'ID inválido.');

    $errors = [];
    if ($nome === '' || mb_strlen($nome) < 2)
        $errors['nome'] = 'O nome deve ter pelo menos 2 caracteres.';
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL))
        $errors['email'] = 'Informe um e-mail válido.';
    elseif (!preg_match('/@gmail\.com$/i', $email))
        $errors['email'] = 'Apenas e-mails @gmail.com são aceitos neste sistema.';
    if ($mensagem === '')
        $errors['mensagem'] = 'A mensagem não pode estar vazia.';
    elseif (mb_strlen($mensagem) > 250)
        $errors['mensagem'] = 'A mensagem deve ter no máximo 250 caracteres.';
    if ($senha !== '' && mb_strlen($senha) < 6)
        $errors['senha'] = 'A nova senha deve ter pelo menos 6 caracteres.';

    if (!empty($errors)) json_out(false, 'Corrija os erros abaixo.', ['errors' => $errors]);

    try {
        $pdo   = getConnection();
        $check = $pdo->prepare('SELECT id FROM registros WHERE id = :id');
        $check->execute([':id' => $id]);
        if (!$check->fetch()) json_out(false, 'Registro não encontrado.');

        if ($senha !== '') {
            $stmt = $pdo->prepare(
                'UPDATE registros SET nome=:nome, email=:email, senha=:senha, mensagem=:mensagem WHERE id=:id'
            );
            $stmt->execute([':nome'=>$nome,':email'=>$email,':senha'=>password_hash($senha,PASSWORD_BCRYPT),':mensagem'=>$mensagem,':id'=>$id]);
        } else {
            $stmt = $pdo->prepare(
                'UPDATE registros SET nome=:nome, email=:email, mensagem=:mensagem WHERE id=:id'
            );
            $stmt->execute([':nome'=>$nome,':email'=>$email,':mensagem'=>$mensagem,':id'=>$id]);
        }
        json_out(true, 'Registro atualizado com sucesso!');
    } catch (PDOException $e) {
        json_out(false, 'Erro ao atualizar o banco de dados. Tente novamente.');
    }
}

// ── DELETE: remove registro ─────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $raw    = file_get_contents('php://input');
    $parsed = json_decode($raw, true);
    if (!$parsed) parse_str($raw, $parsed);

    $id = filter_var($_GET['id'] ?? $parsed['id'] ?? 0, FILTER_VALIDATE_INT);
    if (!$id || $id <= 0) json_out(false, 'ID inválido.');

    try {
        $pdo   = getConnection();
        $check = $pdo->prepare('SELECT id FROM registros WHERE id = :id');
        $check->execute([':id' => $id]);
        if (!$check->fetch()) json_out(false, 'Registro não encontrado.');

        $stmt = $pdo->prepare('DELETE FROM registros WHERE id = :id');
        $stmt->execute([':id' => $id]);
        json_out(true, 'Registro excluído com sucesso!');
    } catch (PDOException $e) {
        json_out(false, 'Erro ao excluir o registro. Tente novamente.');
    }
}

http_response_code(405);
json_out(false, 'Método não permitido.');
