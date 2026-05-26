// ============================================================
// frontend/js/login.js
// Lógica da tela de login — substitui o app.js antigo
// ============================================================
import { loginUsuario, cadastrarUsuario, auth } from './api.js';

let tipoAtual = 'MOTORISTA';

// Redireciona se já estiver logado
if (auth.logado()) {
  const u = auth.getUser();
  window.location.href = u.tipo === 'ESTUDANTE'
    ? 'home-estudante.html'
    : 'home-motorista.html';
}

// ── Toggle Estudante / Motorista ─────────────────────────────
export function setLoginType(tipo) {
  tipoAtual = tipo.toUpperCase();

  document.querySelectorAll('#login-toggle .toggle-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === (tipoAtual === 'ESTUDANTE' ? 0 : 1));
  });

  const field = document.getElementById('login-field1');
  if (field) field.placeholder = tipoAtual === 'ESTUDANTE' ? 'RA' : 'CPF';
}

// Expõe para uso no HTML via onclick
window.setLoginType = setLoginType;

// ── Login ─────────────────────────────────────────────────────
window.doLogin = async function () {
  const identificador = document.getElementById('login-field1').value.trim();
  const senha         = document.getElementById('login-senha').value;
  const btnLogin      = document.getElementById('btn-login');

  if (!identificador || !senha) {
    return showErro('Preencha todos os campos.');
  }

  try {
    btnLogin.disabled    = true;
    btnLogin.textContent = 'Entrando...';

    const { usuario } = await loginUsuario(tipoAtual, identificador, senha);

    window.location.href = usuario.tipo === 'ESTUDANTE'
      ? 'home-estudante.html'
      : 'home-motorista.html';

  } catch (err) {
    showErro(err.message);
  } finally {
    btnLogin.disabled    = false;
    btnLogin.textContent = 'ENTRAR';
  }
};

// ── Cadastro ──────────────────────────────────────────────────
window.doCadastro = async function () {
  const nome  = document.getElementById('cad-nome').value.trim();
  const email = document.getElementById('cad-email').value.trim();
  const senha = document.getElementById('cad-senha').value;
  const ra    = document.getElementById('cad-ra')?.value.trim();
  const cpf   = document.getElementById('cad-cpf')?.value.trim();

  try {
    const { usuario } = await cadastrarUsuario({
      nome, email, senha,
      tipo: tipoAtual,
      ...(tipoAtual === 'ESTUDANTE' ? { ra } : { cpf }),
    });

    window.location.href = usuario.tipo === 'ESTUDANTE'
      ? 'home-estudante.html'
      : 'home-motorista.html';

  } catch (err) {
    showErro(err.message);
  }
};

// ── Helper UI ─────────────────────────────────────────────────
function showErro(msg) {
  let el = document.getElementById('login-erro');
  if (!el) {
    el = document.createElement('p');
    el.id = 'login-erro';
    el.style.cssText = 'color:red;font-size:13px;text-align:center;margin-top:6px;';
    document.querySelector('.form-area').appendChild(el);
  }
  el.textContent = msg;
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => setLoginType('motorista'));