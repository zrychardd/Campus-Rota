import { Router } from 'express';
import { getMeuPerfil, atualizarPerfil } from '../controllers/perfilController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = Router();
router.get('/me', authMiddleware, getMeuPerfil);
router.put('/me', authMiddleware, atualizarPerfil);
export default router;
