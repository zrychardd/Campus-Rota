import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { PrismaClient }   from '@prisma/client';
import { AuthRequest }    from '../middlewares/authMiddleware';
import { Response }       from 'express';

const router = Router();
const prisma = new PrismaClient();

function normalizarTexto(valor: string) {
  return valor
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function proximoHorarioDisponivel() {
  const agora = new Date();
  const horario = new Date(agora);
  const minutos = agora.getMinutes();

  // Próximas viagens em janelas de 30 minutos: 15:10 -> 15:30, 15:40 -> 16:00
  if (minutos < 30) {
    horario.setMinutes(30, 0, 0);
  } else {
    horario.setHours(horario.getHours() + 1, 0, 0, 0);
  }

  return horario;
}

// GET /api/viagem/disponivel — estudante vê o motorista disponível para a rota
router.get('/disponivel', authMiddleware, async (req: AuthRequest, res: Response) => {
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

    const viagem = viagensPendentes.find((v: any) =>
      normalizarTexto(v.partida) === partidaBusca &&
      normalizarTexto(v.destino) === destinoBusca
    );

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
      horario: proximoHorarioDisponivel(),
      passageiros: 0,
      motorista: motorista.usuario
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
});

// GET /api/viagem/minhas — motorista vê suas viagens
router.get('/minhas', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const motorista = await prisma.motorista.findUnique({
      where: { usuarioId: req.usuario!.id }
    });
    if (!motorista) return res.json([]);

    const viagens = await prisma.viagem.findMany({
      where: { motoristaId: motorista.id },
      orderBy: { horario: 'asc' }
    });
    return res.json(viagens);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
});

// PATCH /api/viagem/:id/status — atualiza status da viagem
router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  try {
    const viagem = await prisma.viagem.update({
      where: { id: req.params.id },
      data: { status }
    });
    return res.json(viagem);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
});

export default router;
