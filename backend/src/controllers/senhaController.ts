import { Request, Response } from 'express';
import { PrismaClient }      from '@prisma/client';
import bcrypt                from 'bcryptjs';

const prisma = new PrismaClient();

// POST /api/auth/esqueci-senha/pergunta
export async function buscarPergunta(req: Request, res: Response) {
  const { identificador, tipo } = req.body;
  if (!identificador || !tipo)
    return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
  try {
    const usuario = tipo === 'ESTUDANTE'
      ? await prisma.usuario.findUnique({ where: { ra: identificador } })
      : await prisma.usuario.findUnique({ where: { cpf: identificador } });
    if (!usuario)        return res.status(404).json({ erro: 'Usuário não encontrado.' });
    if (!usuario.perguntaSeg) return res.status(400).json({ erro: 'Pergunta de segurança não cadastrada.' });
    return res.json({ pergunta: usuario.perguntaSeg });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

// POST /api/auth/esqueci-senha/verificar
export async function verificarSeguranca(req: Request, res: Response) {
  const { identificador, tipo, respostaSeg } = req.body;
  if (!identificador || !tipo || !respostaSeg)
    return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
  try {
    const usuario = tipo === 'ESTUDANTE'
      ? await prisma.usuario.findUnique({ where: { ra: identificador } })
      : await prisma.usuario.findUnique({ where: { cpf: identificador } });
    if (!usuario)         return res.status(404).json({ erro: 'Usuário não encontrado.' });
    if (!usuario.respostaSeg) return res.status(400).json({ erro: 'Pergunta não cadastrada.' });
    if (respostaSeg === '__CHECK__') return res.status(401).json({ erro: 'Resposta incorreta.' });
    const ok = respostaSeg.trim().toLowerCase() === usuario.respostaSeg.trim().toLowerCase();
    if (!ok) return res.status(401).json({ erro: 'Resposta incorreta.' });
    return res.json({ ok: true, usuarioId: usuario.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

// POST /api/auth/esqueci-senha/redefinir
export async function redefinirSenha(req: Request, res: Response) {
  const { usuarioId, novaSenha } = req.body;
  if (!usuarioId || !novaSenha) return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
  if (novaSenha.length < 6)     return res.status(400).json({ erro: 'Mínimo de 6 caracteres.' });
  try {
    const hash = await bcrypt.hash(novaSenha, 10);
    await prisma.usuario.update({ where: { id: usuarioId }, data: { senha: hash } });
    return res.json({ mensagem: 'Senha redefinida com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}