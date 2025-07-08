import { Router } from 'express';
import { body, param } from 'express-validator';

// Importa o controller e o middleware de autenticação
import * as agendamentoController from '../controllers/agendamentoController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = Router();

// --- REGRAS DE VALIDAÇÃO ---

// Validação para o ID na URL
const validaId = [
    param('id').isInt({ min: 1 }).withMessage('O ID do agendamento deve ser um número inteiro positivo.')
];

// Regras de validação para a rota de CRIAÇÃO (POST)
const regrasDeCriacao = [
    body('monitoria_id').notEmpty().withMessage('O ID da monitoria é obrigatório.').isInt({ min: 1 }).withMessage('O ID da monitoria deve ser um número inteiro.'),
    body('aluno_id').notEmpty().withMessage('O ID do aluno é obrigatório.').isInt({ min: 1 }).withMessage('O ID do aluno deve ser um número inteiro.'),
    body('data_hora_inicio').notEmpty().withMessage('A data e hora de início são obrigatórias.').isISO8601().withMessage('Formato de data inválido para o início.').toDate(),
    body('data_hora_fim').notEmpty().withMessage('A data e hora de fim são obrigatórias.').isISO8601().withMessage('Formato de data inválido para o fim.').toDate(),
    body('observacoes').optional({ nullable: true }).isString().trim()
];

// Regras de validação para a rota de ATUALIZAÇÃO (PATCH)
const regrasDeAtualizacao = [
    body('data_hora_inicio').optional().isISO8601().withMessage('Formato de data inválido para o início.').toDate(),
    body('data_hora_fim').optional().isISO8601().withMessage('Formato de data inválido para o fim.').toDate(),
    body('status').optional().isIn(['confirmado', 'cancelado', 'realizado', 'ausente']).withMessage("O status deve ser 'confirmado', 'cancelado', 'realizado' ou 'ausente'."),
    body('observacoes').optional({ nullable: true }).isString().trim()
];


// --- ROTAS DE AGENDAMENTO ---
// Todas as rotas são protegidas e requerem que o usuário esteja logado.

// GET /agendamentos -> Listar todos os agendamentos
router.get('/', isLoggedIn, agendamentoController.listarTodos);

// POST /agendamentos -> Criar um novo agendamento
router.post('/', isLoggedIn, regrasDeCriacao, agendamentoController.criarUm);

// GET /agendamentos/:id -> Buscar um agendamento pelo ID
router.get('/:id', isLoggedIn, validaId, agendamentoController.buscarUm);

// PATCH /agendamentos/:id -> Atualizar um agendamento
router.patch('/:id', isLoggedIn, validaId, regrasDeAtualizacao, agendamentoController.atualizarUm);

// DELETE /agendamentos/:id -> Excluir um agendamento
router.delete('/:id', isLoggedIn, validaId, agendamentoController.desativarUm);

//PATCH /:id/reativar -> Reativa uma monitoria.
router.patch('/:id/reativar', isLoggedIn, validaId, agendamentoController.reativarUm);

export default router;