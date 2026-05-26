import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'campus-rota-secret';
export interface AuthRequest extends Request {
  usuario?: { id: string; tipo: string };
}
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token nao fornecido.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; tipo: string };
    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({ erro: 'Token invalido ou expirado.' });
  }
}
