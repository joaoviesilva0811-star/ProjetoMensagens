/* ================================================
   script.js — Formulário · Validação · AJAX · UX
   ================================================ */

'use strict';

// ── Selectors ─────────────────────────────────────
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

let toastTimer = null;

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
  const err = document.getElementById(`err-${field.id}`);
  if (err) { err.textContent = msg; err.classList.add('show'); }
}

function clearError(field) {
  field.classList.remove('error');
  const err = document.getElementById(`err-${field.id}`);
  if (err) { err.classList.remove('show'); }
}

function setValid(field) {
  clearError(field);
  field.classList.add('valid');
}

// ── Email live validation ─────────────────────────
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

// ── Password strength ─────────────────────────────
fieldSenha.addEventListener('input', () => {
  const v = fieldSenha.value;
  let score = 0;
  if (v.length >= 6)  score++;
  if (v.length >= 10) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/\d/.test(v))   score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const pct    = (score / 5) * 100;
  const colors = ['#f06565','#f08a36','#e8a838','#8bc34a','#3ecf8e'];
  strengthFill.style.width      = pct + '%';
  strengthFill.style.background = colors[Math.max(0, score - 1)] || colors[0];
  score >= 1 ? clearError(fieldSenha) : null;
});

// ── Char counter ──────────────────────────────────
fieldMensagem.addEventListener('input', () => {
  const len = fieldMensagem.value.length;
  charCount.textContent = `${len}/250`;
  charCount.className = 'char-counter' + (len > 230 ? (len >= 250 ? ' limit' : ' warn') : '');
  if (len > 0 && len <= 250) clearError(fieldMensagem);
  if (len > 250) setError(fieldMensagem, 'Máximo de 250 caracteres atingido.');
});

// ── Frontend validation ───────────────────────────
function validateForm() {
  let ok = true;

  // Nome
  const nome = fieldNome.value.trim();
  if (nome.length < 2) {
    setError(fieldNome, 'O nome deve ter pelo menos 2 caracteres.'); ok = false;
  } else { setValid(fieldNome); }

  // Email
  const email = fieldEmail.value.trim();
  if (!email) {
    setError(fieldEmail, 'Informe o seu e-mail.'); ok = false;
  } else if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
    setError(fieldEmail, 'Apenas @gmail.com é aceito neste sistema.'); ok = false;
  } else { setValid(fieldEmail); }

  // Senha
  const senha = fieldSenha.value;
  if (senha.length < 6) {
    setError(fieldSenha, 'A senha deve ter pelo menos 6 caracteres.'); ok = false;
  } else { setValid(fieldSenha); }

  // Mensagem
  const msg = fieldMensagem.value.trim();
  if (!msg) {
    setError(fieldMensagem, 'Escreva uma mensagem.'); ok = false;
  } else if (msg.length > 250) {
    setError(fieldMensagem, 'A mensagem deve ter no máximo 250 caracteres.'); ok = false;
  } else { setValid(fieldMensagem); }

  return ok;
}

// ── Submit via AJAX ───────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  // UI: loading
  btnSubmit.disabled   = true;
  btnSpinner.style.display = 'block';
  btnText.textContent  = 'Enviando…';

  try {
    const res  = await fetch('api.php', { method: 'POST', body: new FormData(form) });
    const data = await res.json();

    if (data.ok) {
      showToast('success', 'Enviado!', data.message);
      form.reset();
      charCount.textContent = '0/250';
      charCount.className   = 'char-counter';
      strengthFill.style.width = '0%';
      emailHint.classList.remove('warn');
      emailHintText.textContent = 'Somente @gmail.com é aceito.';
      [fieldNome, fieldEmail, fieldSenha, fieldMensagem].forEach(f => {
        f.classList.remove('valid', 'error');
      });
      document.querySelectorAll('.field-error').forEach(el => el.classList.remove('show'));
      await loadTable(true); // recarrega tabela
    } else {
      showToast('error', 'Atenção', data.message);
      if (data.errors) {
        const map = { nome: fieldNome, email: fieldEmail, senha: fieldSenha, mensagem: fieldMensagem };
        Object.entries(data.errors).forEach(([k, v]) => map[k] && setError(map[k], v));
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
        <tr><td colspan="4">
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
      </tr>`).join('');
  } catch {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-dim);padding:2rem">
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
