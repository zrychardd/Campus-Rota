// ============================================================
// frontend/js/api.js
// Camada centralizada de comunicação com o back-end.
// Todos os fetch() do projeto passam por aqui.
// ============================================================

const BASE_URL = 'http://localhost:3001/api';

// ── Token JWT ────────────────────────────────────────────────
export const auth = {
  getToken:  ()    => localStorage.getItem('cr_token'),
  setToken:  (t)   => localStorage.setItem('cr_token', t),
  getUser:   ()    => JSON.parse(localStorage.getItem('cr_user') || 'null'),
  setUser:   (u)   => localStorage.setItem('cr_user', JSON.stringify(u)),
  clear:     ()    => { localStorage.removeItem('cr_token'); localStorage.removeItem('cr_user'); },
  logado:    ()    => !!localStorage.getItem('cr_token'),
};

// ── Helper de fetch autenticado ──────────────────────────────
async function api(path, options = {}) {
  const token = auth.getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || `Erro ${res.status}`);
  }

  return data;
}

// ── Endpoints de Autenticação ────────────────────────────────

/**
 * Realiza o login do usuário.
 * @param {'ESTUDANTE'|'MOTORISTA'} tipo
 * @param {string} identificador  RA (estudante) ou CPF (motorista)
 * @param {string} senha
 */
export async function loginUsuario(tipo, identificador, senha) {
  const data = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ tipo, identificador, senha }),
  });
  auth.setToken(data.token);
  auth.setUser(data.usuario);
  return data;
}

/**
 * Cadastra um novo usuário.
 * @param {object} payload  { nome, email, senha, tipo, ra? | cpf? }
 */
export async function cadastrarUsuario(payload) {
  const data = await api('/auth/cadastro', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  auth.setToken(data.token);
  auth.setUser(data.usuario);
  return data;
}

// ── Endpoints de Perfil ──────────────────────────────────────

/** Busca o perfil completo do usuário logado. */
export async function getMeuPerfil() {
  return api('/perfil/me');
}

/**
 * Atualiza o perfil do usuário logado.
 * @param {object} dados  { nome?, sobrenome?, veiculo?, placa?, ... }
 */
export async function atualizarPerfil(dados) {
  return api('/perfil/me', {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

// ── Endpoints de Trajeto ─────────────────────────────────────

/** Lista os trajetos salvos do usuário logado. */
export async function listarTrajetos() {
  return api('/trajeto');
}

/**
 * Salva um novo trajeto.
 * @param {string} partida
 * @param {string} destino
 * @param {boolean} frequente
 */
export async function salvarTrajeto(partida, destino, frequente = false) {
  return api('/trajeto', {
    method: 'POST',
    body: JSON.stringify({ partida, destino, frequente }),
  });
}