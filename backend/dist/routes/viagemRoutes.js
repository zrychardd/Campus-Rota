"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
function normalizarTexto(valor) {
    return valor
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
// GET /api/viagem/disponivel — estudante vê o motorista disponível para a rota
router.get('/disponivel', authMiddleware_1.authMiddleware, async (req, res) => {
    const partida = String(req.query.partida || '').trim();
    const destino = String(req.query.destino || '').trim();
    if (!partida || !destino) {
        return res.status(400).json({ erro: 'partida e destino obrigatorios.' });
    }
    try {
        const partidaBusca = normalizarTexto(partida);
        const destinoBusca = normalizarTexto(destino);
        // 1) Primeiro tenta achar uma viagem cadastrada para a rota.
        // A comparação é feita no JS para não falhar por maiúsculas, minúsculas,
        // espaços extras ou acentos.
        const viagensPendentes = await prisma.viagem.findMany({
            where: { status: 'PENDENTE' },
            include: {
                motorista: {
                    include: {
                        usuario: {
                            select: { id: true, nome: true, sobrenome: true }
                        }
                    }
                }
            },
            orderBy: { horario: 'asc' }
        });
        const viagem = viagensPendentes.find((v) => normalizarTexto(v.partida) === partidaBusca &&
            normalizarTexto(v.destino) === destinoBusca);
        if (viagem) {
            return res.json({
                id: viagem.id,
                partida: viagem.partida,
                destino: viagem.destino,
                horario: viagem.horario,
                passageiros: viagem.passageiros,
                motorista: viagem.motorista.usuario
            });
        }
        // 2) Se o motorista só fez o cadastro, mas ainda não cadastrou viagem,
        // ele ainda deve aparecer como disponível para o estudante.
        const motorista = await prisma.motorista.findFirst({
            include: {
                usuario: {
                    select: { id: true, nome: true, sobrenome: true }
                }
            }
        });
        if (!motorista) {
            return res.status(404).json({ erro: 'Nenhum motorista cadastrado.' });
        }
        return res.json({
            id: null,
            partida,
            destino,
            horario: null,
            passageiros: 0,
            motorista: motorista.usuario
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro interno.' });
    }
});
// GET /api/viagem/minhas — motorista vê suas viagens
router.get('/minhas', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const motorista = await prisma.motorista.findUnique({
            where: { usuarioId: req.usuario.id }
        });
        if (!motorista)
            return res.json([]);
        const viagens = await prisma.viagem.findMany({
            where: { motoristaId: motorista.id },
            orderBy: { horario: 'asc' }
        });
        return res.json(viagens);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro interno.' });
    }
});
// PATCH /api/viagem/:id/status — atualiza status da viagem
router.patch('/:id/status', authMiddleware_1.authMiddleware, async (req, res) => {
    const { status } = req.body;
    try {
        const viagem = await prisma.viagem.update({
            where: { id: req.params.id },
            data: { status }
        });
        return res.json(viagem);
    }
    catch (err) {
        return res.status(500).json({ erro: 'Erro interno.' });
    }
});
exports.default = router;
