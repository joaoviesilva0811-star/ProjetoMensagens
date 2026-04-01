<?php
// index.php — Página principal
// (PHP mínimo aqui; toda lógica de dados está em api.php)
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema de Registro</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="wrapper">

  <!-- ── Header ── -->
  <header>
    <h1>Sistema de <em>Registro</em></h1>
    <p>Preencha o formulário abaixo · Somente e-mails <strong>@gmail.com</strong> são aceitos</p>
  </header>

  <!-- ── Grid principal ── -->
  <div class="main-grid">

    <!-- ════ FORMULÁRIO ════ -->
    <div class="card">
      <div class="card-title">
        <span class="icon">✦</span>
        Novo Registro
      </div>

      <form id="form-registro" novalidate autocomplete="off">

        <!-- Nome -->
        <div class="form-group">
          <label for="nome">Nome completo</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Ex.: Maria Silva"
            maxlength="120"
            required>
          <span class="field-error" id="err-nome"></span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">E-mail <span style="color:var(--accent)">(@gmail.com)</span></label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="seunome@gmail.com"
            pattern="[a-zA-Z0-9._%+\-]+@gmail\.com"
            title="Somente endereços @gmail.com são aceitos"
            required>
          <div class="email-hint" id="email-hint">
            <span class="dot"></span>
            <span id="email-hint-text">Somente @gmail.com é aceito neste sistema.</span>
          </div>
          <span class="field-error" id="err-email"></span>
        </div>

        <!-- Senha -->
        <div class="form-group">
          <label for="senha">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            placeholder="Mínimo 6 caracteres"
            minlength="6"
            required>
          <div class="strength-bar"><div class="strength-fill" id="strength-fill"></div></div>
          <span class="field-error" id="err-senha"></span>
        </div>

        <!-- Mensagem -->
        <div class="form-group">
          <label for="mensagem">Mensagem</label>
          <textarea
            id="mensagem"
            name="mensagem"
            placeholder="Escreva sua mensagem aqui… (máx. 250 caracteres)"
            maxlength="250"
            required></textarea>
          <div class="char-wrap">
            <span class="field-error" id="err-mensagem" style="margin-top:0"></span>
            <span class="char-counter" id="char-count">0/250</span>
          </div>
        </div>

        <button type="submit" class="btn-submit" id="btn-submit">
          <span class="btn-spinner" id="btn-spinner"></span>
          <span id="btn-text">Enviar registro</span>
        </button>

      </form>
    </div><!-- /card form -->

    <!-- ════ TABELA ════ -->
    <div class="card">
      <div class="table-header">
        <div class="card-title" style="margin-bottom:0">
          <span class="icon">◈</span>
          Registros salvos
        </div>
        <span class="badge" id="count-badge">…</span>
      </div>

      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Mensagem</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody id="table-body">
            <!-- preenchido via AJAX -->
          </tbody>
        </table>
      </div>

    </div><!-- /card table -->

  </div><!-- /main-grid -->
</div><!-- /wrapper -->

<!-- Toast -->
<div class="toast" id="toast" role="alert" aria-live="polite">
  <div class="toast-icon" id="toast-icon"></div>
  <div class="toast-body">
    <p id="toast-title"></p>
    <p id="toast-msg"></p>
  </div>
</div>

<script src="assets/js/script.js"></script>
</body>
</html>
