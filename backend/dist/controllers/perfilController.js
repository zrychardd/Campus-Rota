"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeuPerfil = getMeuPerfil;
exports.atualizarPerfil = atualizarPerfil;
exports.salvarTrajeto = salvarTrajeto;
exports.listarTrajetos = listarTrajetos;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getMeuPerfil(req, res) {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.usuario.id },
            select: { id: true, nome: true, sobrenome: true, email: true, tipo: true, estudante: true, motorista: true },
        });
        if (!usuario)
            return res.status(404).json({ erro: 'Usuario nao encontrado.' });
        return res.json(usuario);
    }
    catch (err) {
        return res.status(500).json({ erro: 'Erro interno.' });
    }
}
async function atualizarPerfil(req, res) {
    const { nome, sobrenome, veiculo, placa, capacidade } = req.body;
    try {
        const usuario = await prisma.usuario.update({ where: { id: req.usuario.id }, data: { nome, sobrenome } });
        if (req.usuario.tipo === 'MOTORISTA' && (veiculo || placa || capacidade)) {
            await prisma.motorista.update({ where: { usuarioId: req.usuario.id }, data: { veiculo, placa, capacidade } });
        }
        return res.json({ mensagem: 'Perfil atualizado.', usuario });
    }
    catch (err) {
        return res.status(500).json({ erro: 'Erro interno.' });
    }
}
async function salvarTrajeto(req, res) {
    const { partida, destino, frequente } = req.body;
    if (!partida || !destino)
        return res.status(400).json({ erro: 'partida e destino obrigatorios.' });
    try {
        const trajeto = await prisma.trajeto.create({ data: { usuarioId: req.usuario.id, partida, destino, frequente: frequente ?? false } });
        return res.status(201).json(trajeto);
    }
    catch (err) {
        return res.status(500).json({ erro: 'Erro interno.' });
    }
}
async function listarTrajetos(req, res) {
    try {
        const trajetos = await prisma.trajeto.findMany({ where: { usuarioId: req.usuario.id }, orderBy: { createdAt: 'desc' } });
        return res.json(trajetos);
    }
    catch (err) {
        return res.status(500).json({ erro: 'Erro interno.' });
    }
}
