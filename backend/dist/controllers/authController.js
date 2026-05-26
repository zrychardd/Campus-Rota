"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastro = cadastro;
exports.login = login;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'campus-rota-secret';
// POST /api/auth/cadastro
async function cadastro(req, res) {
    const { nome, sobrenome, email, senha, tipo, ra, cpf, perguntaSeg, respostaSeg } = req.body;
    if (!nome || !email || !senha || !tipo)
        return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
    if (tipo === 'ESTUDANTE' && !ra)
        return res.status(400).json({ erro: 'RA obrigatório.' });
    if (tipo === 'MOTORISTA' && !cpf)
        return res.status(400).json({ erro: 'CPF obrigatório.' });
    if (!perguntaSeg || !respostaSeg)
        return res.status(400).json({ erro: 'Pergunta e resposta de segurança obrigatórias.' });
    try {
        const jaExiste = await prisma.usuario.findUnique({ where: { email } });
        if (jaExiste)
            return res.status(409).json({ erro: 'E-mail já cadastrado.' });
        const hash = await bcryptjs_1.default.hash(senha, 10);
        const usuario = await prisma.usuario.create({
            data: {
                nome,
                sobrenome,
                email,
                senha: hash,
                tipo,
                perguntaSeg,
                respostaSeg,
                ...(tipo === 'ESTUDANTE' && { ra, estudante: { create: { ra } } }),
                ...(tipo === 'MOTORISTA' && { cpf, motorista: { create: { cpf } } }),
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({
            token,
            usuario: { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo }
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro interno.' });
    }
}
// POST /api/auth/login
async function login(req, res) {
    const { identificador, senha, tipo } = req.body;
    if (!identificador || !senha || !tipo)
        return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
    try {
        let usuario = null;
        if (tipo === 'ESTUDANTE')
            usuario = await prisma.usuario.findUnique({ where: { ra: identificador } });
        else
            usuario = await prisma.usuario.findUnique({ where: { cpf: identificador } });
        if (!usuario)
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        if (usuario.tipo !== tipo)
            return res.status(403).json({ erro: 'Tipo de usuário incorreto.' });
        const senhaOk = await bcryptjs_1.default.compare(senha, usuario.senha);
        if (!senhaOk)
            return res.status(401).json({ erro: 'Senha incorreta.' });
        const token = jsonwebtoken_1.default.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({
            token,
            usuario: { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo }
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro interno.' });
    }
}
