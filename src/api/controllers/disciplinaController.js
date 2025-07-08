import * as disciplinaService from '../services/disciplinaService.js';
import { validationResult } from 'express-validator';

// Controller para listar todos os usuários ativos
const listarTodas = async (req, res, next) => {
    try {
        const disciplina = await disciplinaService.listar();
        res.status(200).json(disciplina);
    } catch (error) {
        next(error);
    }
};

const buscarUma = async (req, res, next) => {
    try {
        const { id } = req.params;
        const disciplina = await disciplinaService.buscarPorId(id);
        res.status(200).json(disciplina);
    } catch (error) {
        next(error);
    }
};

//Cria uma nova monitoria com base nos dados fornecidos no corpo da requisição.
const criarUma = async (req, res, next) => {
    // 1. Verifica se a validação da rota encontrou erros.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Se houver erros, retorna uma resposta 400 (Bad Request).
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const dadosDisciplina = req.body;
        const novaDisciplina = await disciplinaService.criar(dadosDisciplina);

        res.status(201).json(novaDisciplina);
    } catch (error) {
        next(error);
    }
};

const atualizarUma = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;
        const disciplinaAtualizada = await disciplinaService.atualizar(id, dadosAtualizados);

        res.status(200).json(disciplinaAtualizada);
    } catch (error) {
        next(error);
    }
};

const removerUma = async (req, res, next) => {
    try {
        const { id } = req.params;
        await disciplinaService.remover(id);
        // Resposta 204 No Content é o padrão para DELETE bem-sucedido
        res.status(204).send(); 
    } catch (error) {
        next(error);
    }
};

export {
    listarTodas,
    buscarUma,
    criarUma,
    atualizarUma,
    removerUma
};