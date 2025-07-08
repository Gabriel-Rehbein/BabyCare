import { Router } from 'express';
import * as agendamentoController from '../controllers/agendamentoController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = Router();

// --- ROTAS DE USUÁRIO ---
// Todas as rotas são protegidas e requerem login.
// As rotas foram ajustadas para usar os nomes de função corretos do controller.

// GET / -> Listar todas as monitorias ativas
router.get('/', isLoggedIn, agendamentoController.listarTodos);

//GET / -> Buscar uma monitoria por ID.
router.get('/:id', isLoggedIn, agendamentoController.buscarUma);

export default router;