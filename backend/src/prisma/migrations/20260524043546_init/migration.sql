-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT,
    "email" TEXT NOT NULL,
    "cpf" TEXT,
    "ra" TEXT,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Estudante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "ra" TEXT NOT NULL,
    "universidade" TEXT,
    "curso" TEXT,
    "bolsa100" BOOLEAN NOT NULL DEFAULT true,
    "triagem" TEXT NOT NULL DEFAULT 'PENDENTE',
    CONSTRAINT "Estudante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Motorista" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cnh" TEXT,
    "veiculo" TEXT,
    "placa" TEXT,
    "capacidade" INTEGER NOT NULL DEFAULT 8,
    CONSTRAINT "Motorista_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trajeto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "partida" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "frequente" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trajeto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Viagem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "motoristaId" TEXT NOT NULL,
    "partida" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "horario" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "passageiros" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Viagem_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_ra_key" ON "Usuario"("ra");

-- CreateIndex
CREATE UNIQUE INDEX "Estudante_usuarioId_key" ON "Estudante"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Estudante_ra_key" ON "Estudante"("ra");

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_usuarioId_key" ON "Motorista"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_cpf_key" ON "Motorista"("cpf");
