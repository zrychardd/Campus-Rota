# 🚍 Campus Rota

Sistema inteligente de transporte universitário desenvolvido para conectar estudantes bolsistas a motoristas responsáveis pelo deslocamento acadêmico.

---

## 📌 Sobre o projeto

O **Campus Rota** foi criado para facilitar o acesso ao transporte universitário para estudantes que possuem dificuldades de deslocamento até a instituição de ensino.

A plataforma permite que estudantes pesquisem rotas, reservem viagens e acompanhem o status do transporte, enquanto motoristas podem gerenciar solicitações e acompanhar viagens em tempo real.

---

## 🎯 Objetivos

- Facilitar o deslocamento universitário
- Organizar reservas de transporte
- Integrar estudantes e motoristas
- Gerenciar viagens em uma única plataforma

---

## 🛠 Tecnologias utilizadas

### Front-end
- HTML5
- CSS3
- JavaScript (ES6)

### Back-end
- Node.js
- TypeScript
- Express.js

### Banco de dados
- Prisma ORM
- Banco de dados SQL

---

## 📦 Pré-requisitos

Antes de executar o projeto, instale:

### Node.js (já inclui npm)

Versão recomendada:

```txt
Node.js 18+
```

Baixar:
[Nodejs](https://nodejs.org/pt-br)

Verificar instalação:

```bash
node -v
npm -v
```

---

### Git

Baixar:

[Git](https://git-scm.com/install/)

Verificar instalação:

```bash
git --version
```

---

### Prisma CLI

Instalar globalmente:

```bash
npm install -g prisma
```

Verificar:

```bash
prisma -v
```

---

## ⚙ Funcionalidades

### Estudante
✔ Cadastro  
✔ Login  
✔ Recuperação de senha  
✔ Pesquisa de rota  
✔ Horários disponíveis  
✔ Reserva de viagens  
✔ Histórico de viagens  
✔ Perfil do usuário  

### Motorista
✔ Cadastro  
✔ Login  
✔ Gerenciamento de reservas  
✔ Iniciar rota  
✔ Concluir rota  
✔ Histórico de viagens  
✔ Perfil do motorista  

### Sistema

✔ Controle de vagas

✔ Status de viagem:

- Pendente
- Aceita
- Em andamento
- Concluída
- Cancelada

✔ Validação de dados
✔ Botão visualizar senha
✔ Persistência de login

---

## 📁 Estrutura do projeto

```txt
Campus-Rota/
│
├── frontend/
│   ├── html/
│   ├── css/
│   ├── js/
│   └── assets/
│
├── backend/
│   ├── prisma/
│   │    └── schema.prisma
│   │
│   └── src/
│        ├── controllers/
│        ├── routes/
│        ├── services/
│        └── server.ts
│
└── README.md
```

---

## 🚀 Como executar o projeto

### 1 - Clonar repositório

```bash
git clone https://github.com/zrychardd/Campus-Rota.git
```

### 2 - Entrar na pasta

```bash
cd Campus-Rota
```

### 3 - Instalar dependências

```bash
cd backend
npm install
```

### 4 - Gerar Prisma

```bash
npx prisma generate --schema=src/prisma/schema.prisma
```

### 5 - Atualizar banco

```bash
npx prisma db push --schema=src/prisma/schema.prisma
```

### 6 - Abrir Prisma Studio

```bash
npx prisma studio --schema=src/prisma/schema.prisma
```

### 7 - Iniciar servidor

```bash
npm run dev
```

---

## 🔄 Fluxo do sistema

```txt
Estudante
↓
Pesquisa rota
↓
Seleciona horário
↓
Reserva viagem
↓
Motorista recebe solicitação
↓
Motorista inicia rota
↓
Viagem em andamento
↓
Motorista conclui viagem
↓
Histórico atualizado
```

---

## 📷 Telas do sistema

- Login
- Cadastro
- Home Estudante
- Home Motorista
- Perfil
- Reservas
- Histórico
- Detalhes da Viagem

---

## 📈 Melhorias futuras

- Geolocalização em tempo real
- Notificações push
- Aplicativo Android/iOS
- Chat entre motorista e estudante
- Avaliação de viagens
- Dashboard administrativo

---

Projeto acadêmico – Campus Rota ©
