"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarReserva = criarReserva;
exports.minhasReservas = minhasReservas;
exports.reservasPendentes = reservasPendentes;
exports.aceitarReserva = aceitarReserva;
exports.recusarReserva = recusarReserva;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// POST /api/reserva — estudante solicita reserva
async function criarReserva(req, res) {
    const { partida, destino, motoristaId } = req.body;
    if (!partida || !destino)
        return res.status(400).json({ erro: 'partida e destino obrigatórios.' });
    try {
        const reserva = await prisma.reserva.create({
            data: {
                estudanteId: req.usuario.id,
                partida,
                destino,
                status: 'AGUARDANDO',
                ...(motoristaId && { motoristaId })
            }
        });
        return res.status(201).json(reserva);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro interno.' });
    }
}
// GET /api/reserva/minhas — reservas do estudante logado
async function minhasReservas(req, res) {
    try {
        const reservas = await prisma.reserva.findMany({
            where: { estudanteId: req.usuario.id },
            orderBy: { createdAt: 'desc' }
        });
        return res.json(reservas);
    }
    catch (err) {
        return res.status(500).json({ erro: 'Erro interno.' });
    }
}
// GET /api/reserva/pendentes — motorista vê reservas aguardando
async function reservasPendentes(req, res) {
    try {
        const reservas = await prisma.reserva.findMany({
            where: { status: 'AGUARDANDO' },
            include: {
                estudante: { select: { nome: true, sobrenome: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return res.json(reservas);
    }
    catch (err) {
        return res.status(500).json({ erro: 'Erro interno.' });
    }
}
// PATCH /api/reserva/:id/aceitar — motorista aceita reserva
async function aceitarReserva(req, res) {
    const { id } = req.params;
    if (req.usuario.tipo !== 'MOTORISTA')
        return res.status(403).json({ erro: 'Apenas motoristas podem aceitar reservas.' });
    try {
        const motorista = await prisma.motorista.findUnique({
            where: { usuarioId: req.usuario.id }
        });
        if (!motorista) {
            return res.status(404).json({ erro: 'Perfil de motorista não encontrado.' });
        }
        const reservaExistente = await prisma.reserva.findUnique({
            where: { id },
            include: { estudante: { select: { id: true, nome: true, sobrenome: true } } }
        });
        if (!reservaExistente) {
            return res.status(404).json({ erro: 'Reserva não encontrada.' });
        }
        if (reservaExistente.status === 'RECUSADA') {
            return res.status(400).json({ erro: 'Esta reserva já foi recusada.' });
        }
        // Ao aceitar uma reserva, ela vira uma rota pendente na Home do motorista.
        // Mantemos Reserva e Viagem separados: Reserva guarda a solicitação do estudante,
        // Viagem controla o fluxo do motorista: PENDENTE -> EM_ANDAMENTO -> CONCLUIDA.
        const resultado = await prisma.$transaction(async (tx) => {
            const reserva = await tx.reserva.update({
                where: { id },
                data: { status: 'CONFIRMADA', motoristaId: req.usuario.id },
                include: { estudante: { select: { id: true, nome: true, sobrenome: true } } }
            });
            const viagemAberta = await tx.viagem.findFirst({
                where: {
                    motoristaId: motorista.id,
                    partida: reserva.partida,
                    destino: reserva.destino,
                    status: { in: ['PENDENTE', 'EM_ANDAMENTO'] }
                }
            });
            const viagem = viagemAberta
                ? await tx.viagem.update({
                    where: { id: viagemAberta.id },
                    data: { passageiros: { increment: 1 } }
                })
                : await tx.viagem.create({
                    data: {
                        motoristaId: motorista.id,
                        partida: reserva.partida,
                        destino: reserva.destino,
                        horario: new Date(),
                        status: 'PENDENTE',
                        passageiros: 1
                    }
                });
            return { reserva, viagem };
        });
        return res.json(resultado);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro interno.' });
    }
}
// PATCH /api/reserva/:id/recusar — motorista recusa reserva
async function recusarReserva(req, res) {
    const { id } = req.params;
    if (req.usuario.tipo !== 'MOTORISTA')
        return res.status(403).json({ erro: 'Apenas motoristas podem recusar reservas.' });
    try {
        const reserva = await prisma.reserva.update({
            where: { id },
            data: { status: 'RECUSADA' }
        });
        return res.json(reserva);
    }
    catch (err) {
        return res.status(500).json({ erro: 'Erro interno.' });
    }
}
