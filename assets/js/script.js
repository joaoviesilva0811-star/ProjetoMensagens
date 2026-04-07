/* ================================================
   script.js — Formulário · Validação · AJAX · CRUD
   ================================================ */

'use strict';

// ── Selectors: formulário de criação ─────────────
const form       = document.getElementById('form-registro');
const btnSubmit  = document.getElementById('btn-submit');
const btnSpinner = document.getElementById('btn-spinner');
const btnText    = document.getElementById('btn-text');

const fieldNome     = document.getElementById('nome');
const fieldEmail    = document.getElementById('email');
const fieldSenha    = document.getElementById('senha');
const fieldMensagem = document.getElementById('mensagem');

const emailHint     = document.getElementById('email-hint');
const emailHintText = document.getElementById('email-hint-text');
const charCount     = document.getElementById('char-count');
const strengthFill  = document.getElementById('strength-fill');

const toast      = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMsg   = document.getElementById('toast-msg');

const tableBody  = document.getElementById('table-body');
const countBadge = document.getElementById('count-badge');

// ── Selectors: modal de edição ────────────────────
const modalOverlay    = document.getElementById('modal-overlay');
const modalClose      = document.getElementById('modal-close');
const btnCancel       = document.getElementById('btn-cancel');
const formEdit        = document.getElementById('form-edit');
const editId          = document.getElementById('edit-id');
const editNome        = document.getElementById('edit-nome');
const editEmail       = document.getElementById('edit-email');
const editSenha       = document.getElementById('edit-senha');
const editMensagem    = document.getElementById('edit-mensagem');
const editCharCount   = document.getElementById('edit-char-count');
const editStrength    = document.getElementById('edit-strength-fill');
const btnEditSubmit   = document.getElementById('btn-edit-submit');
const btnEditSpinner  = document.getElementById('btn-edit-spinner');
const btnEditText     = document.getElementById('btn-edit-text');

// ── Selectors: modal de exclusão ──────────────────
const modalDelete       = document.getElementById('modal-delete');
const deleteNomeLabel   = document.getElementById('delete-nome');
const btnDeleteCancel   = document.getElementById('btn-delete-cancel');
const btnDeleteConfirm  = document.getElementById('btn-delete-confirm');
const btnDeleteSpinner  = document.getElementById('btn-delete-spinner');
const btnDeleteText     = document.getElementById('btn-delete-text');

let toastTimer    = null;
let pendingDelete = null; // id do registro aguardando confirmação

// ── Toast ─────────────────────────────────────────
function showToast(type, title, msg) {
  toast.className = `toast ${type}`;
  toastTitle.textContent = title;
  toastMsg.textContent   = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
}

// ── Field error helpers ───────────────────────────
function setError(field, msg) {
  field.classList.add('error');
  field.classList.remove('valid');
  const id  = field.id.startsWith('edit-') ? `err-${field.id}` : `err-${field.id}`;
  const err = document.getElementById(id);
  if (err) { err.textContent = msg; err.classList.add('show'); }
}

function clearError(field) {
  field.classList.remove('error');
  const id  = field.id.startsWith('edit-') ? `err-${field.id}` : `err-${field.id}`;
  const err = document.getElementById(id);
  if (err) err.classList.remove('show');
}

function setValid(field) {
  clearError(field);
  field.classList.add('valid');
}

function clearFields(fields) {
  fields.forEach(f => { f.classList.remove('valid', 'error'); });
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('show'));
}

// ── Email live validation (criação) ──────────────
fieldEmail.addEventListener('input', () => {
  const val = fieldEmail.value.trim();
  if (val === '') {
    emailHint.classList.remove('warn');
    emailHintText.textContent = 'Somente @gmail.com é aceito.';
    return;
  }
  const isGmail = /^[^\s@]+@gmail\.com$/i.test(val);
  emailHint.classList.toggle('warn', !isGmail);
  emailHintText.textContent = isGmail
    ? '✓ E-mail Gmail válido!'
    : '⚠ Somente @gmail.com é permitido neste sistema.';
  isGmail ? setValid(fieldEmail) : setError(fieldEmail, 'Use um e-mail @gmail.com.');
});

// ── Password strength (criação) ───────────────────
fieldSenha.addEventListener('input', () => updateStrength(fieldSenha.value, strengthFill));
editSenha.addEventListener('input',  () => updateStrength(editSenha.value,  editStrength));

function updateStrength(v, bar) {
  let score = 0;
  if (v.length >= 6)  score++;
  if (v.length >= 10) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/\d/.test(v))   score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const colors = ['#f06565','#f08a36','#e8a838','#8bc34a','#3ecf8e'];
  bar.style.width      = ((score / 5) * 100) + '%';
  bar.style.background = colors[Math.max(0, score - 1)] || colors[0];
}

// ── Char counters ─────────────────────────────────
fieldMensagem.addEventListener('input', () => updateCharCount(fieldMensagem, charCount));
editMensagem.addEventListener('input',  () => updateCharCount(editMensagem, editCharCount));

function updateCharCount(field, counter) {
  const len = field.value.length;
  counter.textContent = `${len}/250`;
  counter.className = 'char-counter' + (len > 230 ? (len >= 250 ? ' limit' : ' warn') : '');
  if (len > 0 && len <= 250) clearError(field);
  if (len > 250) setError(field, 'Máximo de 250 caracteres atingido.');
}

// ── Validação genérica ────────────────────────────
function validateFields(nome, email, senha, mensagem, senhaObrigatoria = true) {
  const errors = {};

  if (!nome || nome.length < 2)
    errors.nome = 'O nome deve ter pelo menos 2 caracteres.';

  if (!email)
    errors.email = 'Informe o seu e-mail.';
  else if (!/^[^\s@]+@gmail\.com$/i.test(email))
    errors.email = 'Apenas @gmail.com é aceito neste sistema.';

  if (senhaObrigatoria && senha.length < 6)
    errors.senha = 'A senha deve ter pelo menos 6 caracteres.';
  else if (!senhaObrigatoria && senha !== '' && senha.length < 6)
    errors.senha = 'A nova senha deve ter pelo menos 6 caracteres.';

  if (!mensagem)
    errors.mensagem = 'Escreva uma mensagem.';
  else if (mensagem.length > 250)
    errors.mensagem = 'A mensagem deve ter no máximo 250 caracteres.';

  return errors;
}

// ── Submit: CRIAR ─────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome     = fieldNome.value.trim();
  const email    = fieldEmail.value.trim();
  const senha    = fieldSenha.value;
  const mensagem = fieldMensagem.value.trim();

  const errors = validateFields(nome, email, senha, mensagem, true);
  const fieldMap = { nome: fieldNome, email: fieldEmail, senha: fieldSenha, mensagem: fieldMensagem };

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([k, v]) => setError(fieldMap[k], v));
    Object.keys(fieldMap).filter(k => !errors[k]).forEach(k => setValid(fieldMap[k]));
    return;
  }
  Object.values(fieldMap).forEach(f => setValid(f));

  btnSubmit.disabled        = true;
  btnSpinner.style.display  = 'block';
  btnText.textContent       = 'Enviando…';

  try {
    const res  = await fetch('api.php', { method: 'POST', body: new FormData(form) });
    const data = await res.json();

    if (data.ok) {
      showToast('success', 'Enviado!', data.message);
      form.reset();
      charCount.textContent    = '0/250';
      charCount.className      = 'char-counter';
      strengthFill.style.width = '0%';
      emailHint.classList.remove('warn');
      emailHintText.textContent = 'Somente @gmail.com é aceito.';
      clearFields([fieldNome, fieldEmail, fieldSenha, fieldMensagem]);
      await loadTable(true);
    } else {
      showToast('error', 'Atenção', data.message);
      if (data.errors) {
        Object.entries(data.errors).forEach(([k, v]) => fieldMap[k] && setError(fieldMap[k], v));
      }
    }
  } catch {
    showToast('error', 'Erro de conexão', 'Não foi possível contactar o servidor.');
  } finally {
    btnSubmit.disabled       = false;
    btnSpinner.style.display = 'none';
    btnText.textContent      = 'Enviar registro';
  }
});

// ── Modal de edição: abrir ────────────────────────
function openEditModal(row) {
  editId.value             = row.id;
  editNome.value           = row.nome;
  editEmail.value          = row.email;
  editSenha.value          = '';
  editMensagem.value       = row.mensagem;
  editCharCount.textContent = `${row.mensagem.length}/250`;
  editCharCount.className  = 'char-counter';
  editStrength.style.width = '0%';
  clearFields([editNome, editEmail, editSenha, editMensagem]);
  modalOverlay.classList.add('show');
  editNome.focus();
}

function closeEditModal() {
  modalOverlay.classList.remove('show');
}

modalClose.addEventListener('click', closeEditModal);
btnCancel.addEventListener('click',  closeEditModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeEditModal(); });

// ── Submit: ATUALIZAR ─────────────────────────────
formEdit.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id       = editId.value;
  const nome     = editNome.value.trim();
  const email    = editEmail.value.trim();
  const senha    = editSenha.value;
  const mensagem = editMensagem.value.trim();

  const errors   = validateFields(nome, email, senha, mensagem, false);
  const fieldMap = { nome: editNome, email: editEmail, senha: editSenha, mensagem: editMensagem };

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([k, v]) => setError(fieldMap[k], v));
    Object.keys(fieldMap).filter(k => !errors[k]).forEach(k => setValid(fieldMap[k]));
    return;
  }
  Object.values(fieldMap).forEach(f => setValid(f));

  btnEditSubmit.disabled       = true;
  btnEditSpinner.style.display = 'block';
  btnEditText.textContent      = 'Salvando…';

  try {
    const payload = { id, nome, email, mensagem };
    if (senha) payload.senha = senha;

    const res  = await fetch('api.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.ok) {
      showToast('success', 'Atualizado!', data.message);
      closeEditModal();
      await loadTable();
    } else {
      showToast('error', 'Atenção', data.message);
      if (data.errors) {
        Object.entries(data.errors).forEach(([k, v]) => fieldMap[k] && setError(fieldMap[k], v));
      }
    }
  } catch {
    showToast('error', 'Erro de conexão', 'Não foi possível contactar o servidor.');
  } finally {
    btnEditSubmit.disabled       = false;
    btnEditSpinner.style.display = 'none';
    btnEditText.textContent      = 'Salvar alterações';
  }
});

// ── Modal de exclusão: abrir/fechar ──────────────
function openDeleteModal(row) {
  pendingDelete          = row.id;
  deleteNomeLabel.textContent = row.nome;
  modalDelete.classList.add('show');
}

function closeDeleteModal() {
  modalDelete.classList.remove('show');
  pendingDelete = null;
}

btnDeleteCancel.addEventListener('click', closeDeleteModal);
modalDelete.addEventListener('click', (e) => { if (e.target === modalDelete) closeDeleteModal(); });

// ── Confirmar: DELETAR ────────────────────────────
btnDeleteConfirm.addEventListener('click', async () => {
  if (!pendingDelete) return;

  btnDeleteConfirm.disabled      = true;
  btnDeleteSpinner.style.display = 'block';
  btnDeleteText.textContent      = 'Excluindo…';

  try {
    const res  = await fetch(`api.php?id=${pendingDelete}`, { method: 'DELETE' });
    const data = await res.json();

    if (data.ok) {
      showToast('success', 'Excluído!', data.message);
      closeDeleteModal();
      await loadTable();
    } else {
      showToast('error', 'Erro', data.message);
      closeDeleteModal();
    }
  } catch {
    showToast('error', 'Erro de conexão', 'Não foi possível contactar o servidor.');
  } finally {
    btnDeleteConfirm.disabled      = false;
    btnDeleteSpinner.style.display = 'none';
    btnDeleteText.textContent      = 'Sim, excluir';
  }
});

// ── Load table ────────────────────────────────────
async function loadTable(highlightFirst = false) {
  try {
    const res  = await fetch('api.php');
    const data = await res.json();
    if (!data.ok) return;

    const rows = data.data;
    countBadge.textContent = rows.length;

    if (rows.length === 0) {
      tableBody.innerHTML = `
        <tr><td colspan="5">
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <p>Nenhum registro encontrado.<br>Preencha o formulário ao lado!</p>
          </div>
        </td></tr>`;
      return;
    }

    tableBody.innerHTML = rows.map((r, i) => `
      <tr class="${highlightFirst && i === 0 ? 'row-new' : ''}">
        <td class="td-nome">${escapeHtml(r.nome)}</td>
        <td class="td-email">${escapeHtml(r.email)}</td>
        <td class="td-msg">${escapeHtml(r.mensagem)}</td>
        <td style="color:var(--text-dim);font-size:.78rem;white-space:nowrap;font-family:'JetBrains Mono',monospace">
          ${formatDate(r.criado_em)}
        </td>
        <td class="td-actions">
          <button class="btn-action btn-edit"   data-id="${r.id}" title="Editar">✎</button>
          <button class="btn-action btn-delete" data-id="${r.id}" title="Excluir">✕</button>
        </td>
      </tr>`).join('');

    // Guarda os dados em cache por id para abrir o modal já preenchido
    window._registros = {};
    rows.forEach(r => { window._registros[r.id] = r; });

    // Delegação de eventos
    tableBody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(window._registros[btn.dataset.id]));
    });
    tableBody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(window._registros[btn.dataset.id]));
    });

  } catch {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-dim);padding:2rem">
      Erro ao carregar dados.</td></tr>`;
  }
}

// ── Shimmer loader ────────────────────────────────
function showShimmer() {
  tableBody.innerHTML = Array(3).fill(`
    <tr class="shimmer-row">
      <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
    </tr>`).join('');
}

// ── Utils ─────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str.replace(' ','T'));
  return d.toLocaleDateString('pt-BR') + ' ' +
         d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
}

// ── Init ──────────────────────────────────────────
showShimmer();
loadTable();
