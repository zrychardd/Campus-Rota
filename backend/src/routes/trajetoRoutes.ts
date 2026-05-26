import { Router } from 'express';
import { salvarTrajeto, listarTrajetos } from '../controllers/perfilController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = Router();
router.get('/', authMiddleware, listarTrajetos);
router.post('/', authMiddleware, salvarTrajeto);
export default router;
