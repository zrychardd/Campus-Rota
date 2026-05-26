import { Router }   from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest }  from '../middlewares/authMiddleware';
import { Response }     from 'express';
import {
  criarReserva,
  minhasReservas,
  reservasPendentes,
  aceitarReserva,
  recusarReserva
} from '../controllers/reservaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.post('/',             authMiddleware, criarReserva);
router.get('/minhas',        authMiddleware, minhasReservas);
router.get('/pendentes',     authMiddleware, reservasPendentes);
router.patch('/:id/aceitar', authMiddleware, aceitarReserva);
router.patch('/:id/recusar', authMiddleware, recusarReserva);

// GET /api/reserva/todas — motorista vê todas as reservas (qualquer status)
router.get('/todas', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        estudante: { select: { nome: true, sobrenome: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(reservas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
});

export default router;