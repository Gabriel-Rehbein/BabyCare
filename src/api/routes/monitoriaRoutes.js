import * as monitoriaController from '../controllers/monitoriaController.js';
import { Router } from 'express';
import { body, param } from 'express-validator';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = Router();

const validaId = [
    param('id').isInt({ min: 1 }).withMessage('O ID da monitoria deve ser um número inteiro positivo.')
];

const regrasDeAtualizacao = [
    body('horarios_disponiveis').optional().isJSON().withMessage('Os horários disponíveis devem estar em formato JSON.'),
    body('local').optional().isString().withMessage('O local deve ser um texto.').trim().notEmpty().withMessage('O local não pode ser vazio.'),
    body('status').optional().isIn(['ativa', 'inativa', 'concluida']).withMessage("O status deve ser 'ativa', 'inativa' ou 'concluida'.")
];

// --- ROTAS DE USUÁRIO ---
// Todas as rotas são protegidas e requerem login.
// As rotas foram ajustadas para usar os nomes de função corretos do controller.

// GET / -> Listar todas as monitorias ativas.
router.get('/', isLoggedIn, monitoriaController.listarTodas);

//GET / -> Buscar uma monitoria pelo ID.
router.get('/:id', isLoggedIn, monitoriaController.buscarUma);

//PATCH / -> Atualizar uma monitoria pelo ID.
router.patch('/:id', isLoggedIn, validaId, regrasDeAtualizacao, monitoriaController.atualizarUma);

// DELETE /:id -> Desativar uma monitoria (soft delete)
router.delete('/:id', isLoggedIn, monitoriaController.deletarUma);

//PATCH /:id/reativar -> Reativa uma monitoria.
router.patch('/:id/reativar', isLoggedIn, monitoriaController.reativarUma);

export default router;