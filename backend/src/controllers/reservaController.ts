import { Response }     from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest }  from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// POST /api/reserva — estudante solicita reserva
export async function criarReserva(req: AuthRequest, res: Response) {
  const { partida, destino, motoristaId, viagemId, horario } = req.body;
  if (!partida || !destino)
    return res.status(400).json({ erro: 'partida e destino obrigatórios.' });
  try {
    const reserva = await prisma.reserva.create({
      data: {
        estudanteId: req.usuario!.id,
        partida,
        destino,
        status: 'AGUARDANDO',
        ...(motoristaId && { motoristaId }),
        ...(viagemId && { viagemId }),
        ...(horario && { horario: new Date(horario) })
      }
    });
    return res.status(201).json(reserva);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

// GET /api/reserva/minhas — reservas do estudante logado
export async function minhasReservas(req: AuthRequest, res: Response) {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { estudanteId: req.usuario!.id },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(reservas);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

// GET /api/reserva/pendentes — motorista vê reservas aguardando
export async function reservasPendentes(req: AuthRequest, res: Response) {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { status: 'AGUARDANDO' },
      include: {
        estudante: { select: { nome: true, sobrenome: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(reservas);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

// PATCH /api/reserva/:id/aceitar — motorista aceita reserva
export async function aceitarReserva(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (req.usuario!.tipo !== 'MOTORISTA')
    return res.status(403).json({ erro: 'Apenas motoristas podem aceitar reservas.' });

  try {
    const motorista = await prisma.motorista.findUnique({
      where: { usuarioId: req.usuario!.id }
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
    const resultado = await prisma.$transaction(async (tx: any) => {
      const reserva = await tx.reserva.update({
        where: { id },
        data: { status: 'CONFIRMADA', motoristaId: req.usuario!.id },
        include: { estudante: { select: { id: true, nome: true, sobrenome: true } } }
      });

      const horarioViagem = reserva.horario || new Date();

      const viagemPorReserva = reserva.viagemId
        ? await tx.viagem.findFirst({
            where: {
              id: reserva.viagemId,
              motoristaId: motorista.id,
              status: { in: ['PENDENTE', 'EM_ANDAMENTO'] }
            }
          })
        : null;

      const viagemAberta = viagemPorReserva || await tx.viagem.findFirst({
        where: {
          motoristaId: motorista.id,
          partida: reserva.partida,
          destino: reserva.destino,
          horario: horarioViagem,
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
              horario: horarioViagem,
              status: 'PENDENTE',
              passageiros: 1
            }
          });

      return { reserva, viagem };
    });

    return res.json(resultado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

// PATCH /api/reserva/:id/recusar — motorista recusa reserva
export async function recusarReserva(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (req.usuario!.tipo !== 'MOTORISTA')
    return res.status(403).json({ erro: 'Apenas motoristas podem recusar reservas.' });
  try {
    const reserva = await prisma.reserva.update({
      where: { id },
      data: { status: 'RECUSADA' }
    });
    return res.json(reserva);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}