-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN "perguntaSeg" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "respostaSeg" TEXT;

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "estudanteId" TEXT NOT NULL,
    "motoristaId" TEXT,
    "partida" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGUARDANDO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reserva_estudanteId_fkey" FOREIGN KEY ("estudanteId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reserva_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
