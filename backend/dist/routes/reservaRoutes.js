"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const reservaController_1 = require("../controllers/reservaController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/', authMiddleware_1.authMiddleware, reservaController_1.criarReserva);
router.get('/minhas', authMiddleware_1.authMiddleware, reservaController_1.minhasReservas);
router.get('/pendentes', authMiddleware_1.authMiddleware, reservaController_1.reservasPendentes);
router.patch('/:id/aceitar', authMiddleware_1.authMiddleware, reservaController_1.aceitarReserva);
router.patch('/:id/recusar', authMiddleware_1.authMiddleware, reservaController_1.recusarReserva);
// GET /api/reserva/todas — motorista vê todas as reservas (qualquer status)
router.get('/todas', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const reservas = await prisma.reserva.findMany({
            include: {
                estudante: { select: { nome: true, sobrenome: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return res.json(reservas);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro interno.' });
    }
});
exports.default = router;
