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
              <th>Ações</th>
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

<!-- ════ MODAL DE EDIÇÃO ════ -->
<div class="modal-overlay" id="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal-card">
    <div class="modal-header">
      <div class="card-title" id="modal-title" style="margin-bottom:0">
        <span class="icon">✎</span>
        Editar Registro
      </div>
      <button class="modal-close" id="modal-close" aria-label="Fechar">✕</button>
    </div>

    <form id="form-edit" novalidate autocomplete="off">
      <input type="hidden" id="edit-id">

      <!-- Nome -->
      <div class="form-group">
        <label for="edit-nome">Nome completo</label>
        <input type="text" id="edit-nome" name="nome" placeholder="Ex.: Maria Silva" maxlength="120" required>
        <span class="field-error" id="err-edit-nome"></span>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="edit-email">E-mail <span style="color:var(--accent)">(@gmail.com)</span></label>
        <input type="email" id="edit-email" name="email" placeholder="seunome@gmail.com" required>
        <span class="field-error" id="err-edit-email"></span>
      </div>

      <!-- Nova Senha (opcional) -->
      <div class="form-group">
        <label for="edit-senha">Nova senha <span style="color:var(--text-muted);font-weight:400;text-transform:none;letter-spacing:0">(deixe em branco para manter)</span></label>
        <input type="password" id="edit-senha" name="senha" placeholder="Mínimo 6 caracteres (opcional)">
        <div class="strength-bar"><div class="strength-fill" id="edit-strength-fill"></div></div>
        <span class="field-error" id="err-edit-senha"></span>
      </div>

      <!-- Mensagem -->
      <div class="form-group">
        <label for="edit-mensagem">Mensagem</label>
        <textarea id="edit-mensagem" name="mensagem" placeholder="Escreva sua mensagem… (máx. 250 caracteres)" maxlength="250" required></textarea>
        <div class="char-wrap">
          <span class="field-error" id="err-edit-mensagem" style="margin-top:0"></span>
          <span class="char-counter" id="edit-char-count">0/250</span>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn-cancel" id="btn-cancel">Cancelar</button>
        <button type="submit" class="btn-submit" id="btn-edit-submit" style="width:auto;padding:.75rem 2rem">
          <span class="btn-spinner" id="btn-edit-spinner"></span>
          <span id="btn-edit-text">Salvar alterações</span>
        </button>
      </div>
    </form>
  </div>
</div>

<!-- ════ MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ════ -->
<div class="modal-overlay" id="modal-delete" role="dialog" aria-modal="true">
  <div class="modal-card modal-card--sm">
    <div class="modal-header">
      <div class="card-title" style="margin-bottom:0;color:var(--red)">
        <span class="icon" style="background:var(--red-dim);border-color:rgba(240,101,101,.3)">✕</span>
        Excluir registro
      </div>
    </div>
    <p style="color:var(--text-muted);font-size:.93rem;margin-bottom:1.5rem;line-height:1.6">
      Tem certeza que deseja excluir o registro de <strong id="delete-nome" style="color:var(--text)"></strong>?
      <br>Esta ação <strong style="color:var(--red)">não pode ser desfeita</strong>.
    </p>
    <div class="modal-actions">
      <button type="button" class="btn-cancel" id="btn-delete-cancel">Cancelar</button>
      <button type="button" class="btn-delete-confirm" id="btn-delete-confirm">
        <span class="btn-spinner" id="btn-delete-spinner"></span>
        <span id="btn-delete-text">Sim, excluir</span>
      </button>
    </div>
  </div>
</div>

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
