import { Router } from 'express';
import { cadastro, login } from '../controllers/authController';
import { buscarPergunta, verificarSeguranca, redefinirSenha } from '../controllers/senhaController';

const router = Router();

router.post('/cadastro',                cadastro);
router.post('/login',                   login);
router.post('/esqueci-senha/pergunta',  buscarPergunta);
router.post('/esqueci-senha/verificar', verificarSeguranca);
router.post('/esqueci-senha/redefinir', redefinirSenha);

export default router;