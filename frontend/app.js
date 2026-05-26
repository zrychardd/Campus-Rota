/* ============================================================
   CAMPUS ROTA — app.js
   Navegação e lógica global compartilhada entre todas as telas
   ============================================================ */

let currentUser = 'motorista'; // 'estudante' ou 'motorista'
let prevScreen = 'login';      // controle de voltar

/* ---------- LOGIN ---------- */

/**
 * Alterna o tipo de usuário no login (Estudante / Motorista)
 * Chamado pelos botões do toggle na login.html
 */
function setLoginType(type) {
  currentUser = type;

  const btns = document.querySelectorAll('#login-toggle .toggle-btn');
  btns[0].classList.toggle('active', type === 'estudante');
  btns[1].classList.toggle('active', type === 'motorista');

  const field = document.getElementById('login-field1');
  if (field) field.placeholder = type === 'estudante' ? 'RA' : 'CPF';
}

/**
 * Executa o login e redireciona para a home correta
 */
function doLogin() {
  if (currentUser === 'estudante') {
    window.location.href = 'home-estudante.html';
  } else {
    window.location.href = 'home-motorista.html';
  }
}

/* ---------- NAVEGAÇÃO GERAL ---------- */

/**
 * Navega para outra página HTML
 * @param {string} page - nome do arquivo (ex: 'perfil.html')
 */
function goTo(page) {
  window.location.href = page;
}

/**
 * Volta para a página anterior no histórico do navegador
 */
function goBack() {
  window.history.back();
}

/* ---------- ABAS (usado em home-motorista.html) ---------- */

/**
 * Ativa a aba clicada e desativa as demais
 */
function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

/* ---------- INICIALIZAÇÃO POR PÁGINA ---------- */

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  if (page === 'login.html' || page === '' || page === 'index.html') {
    setLoginType('motorista');
  }

  if (page === 'home-motorista.html') {
    initTabs();
  }
});