import { Router } from 'express';
import { body, param } from 'express-validator';
// Importa os controllers e o middleware de autenticação
import * as disciplinaController from '../controllers/disciplinaController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = Router();

// --- REGRAS DE VALIDAÇÃO ---

// Validação para o ID na URL
const validaId = [
    param('id').isInt({ min: 1 }).withMessage('O ID da disciplina deve ser um número inteiro positivo.')
];

// Regras de validação para a rota de CRIAÇÃO (POST)
const regrasDeCriacao = [
    body('nome').notEmpty().withMessage('O nome é obrigatório.').isString().withMessage('O nome deve ser um texto.').trim(),
    body('codigo').notEmpty().withMessage('O código é obrigatório.').isString().withMessage('O código deve ser um texto.').trim()
];

// Regras de validação para a rota de ATUALIZAÇÃO (PATCH)
const regrasDeAtualizacao = [
    body('nome').optional().isString().withMessage('O nome deve ser um texto.').trim().notEmpty().withMessage('O nome não pode ser vazio.'),
    body('codigo').optional().isString().withMessage('O código deve ser um texto.').trim().notEmpty().withMessage('O código não pode ser vazio.')
];


// --- ROTAS DE DISCIPLINA ---
// Todas as rotas são protegidas e requerem que o usuário esteja logado.

// GET /disciplinas -> Listar todas as disciplinas
router.get('/', isLoggedIn, disciplinaController.listarTodas);

// POST /disciplinas -> Criar uma nova disciplina
router.post('/', isLoggedIn, regrasDeCriacao, disciplinaController.criarUma);

// GET /disciplinas/:id -> Buscar uma disciplina pelo ID
router.get('/:id', isLoggedIn, validaId, disciplinaController.buscarUma);

// PATCH /disciplinas/:id -> Atualizar uma disciplina pelo ID
router.patch('/:id', isLoggedIn, validaId, regrasDeAtualizacao, disciplinaController.atualizarUma);

// DELETE /disciplinas/:id -> Excluir uma disciplina pelo ID
router.delete('/:id', isLoggedIn, validaId, disciplinaController.removerUma);

export default router;