import * as agendamentoService from '../services/agendamentoService.js';
import * as monitoriaService from '../services/monitoriaService.js';

import { validationResult } from 'express-validator';

// Controller para listar todos os usuários ativos
const listarTodos = async (req, res, next) => {
    try {
        const agendamento = await agendamentoService.listar();
        res.status(200).json(agendamento);
    } catch (error) {
        next(error);
    }
};

const buscarUm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const agendamento = await agendamentoService.buscarPorId(id);
        res.status(200).json(agendamento);
    } catch (error) {
        next(error);
    }
};

const criarUm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const dadosAgendamento = req.body;
        const novoAgendamento = await agendamentoService.criar(dadosAgendamento);
        
        res.status(201).json(novoAgendamento);
    } catch (error) {
        next(error);
    }
};

const atualizarUm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;
        const agendamentoAtualizado = await agendamentoService.atualizar(id, dadosAtualizados);

        res.status(200).json(agendamentoAtualizado);
    } catch (error) {
        next(error);
    }
};

// Controller para desativar (soft delete) um usuário
const desativarUm = async (req, res, next) => {
    try {
        const { id } = req.params;
        await agendamentoService.desativar(id);
        // Resposta 204 No Content é o padrão para DELETE bem-sucedido
        res.status(204).send(); 
    } catch (error) {
        next(error);
    }
};

const reativarUm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const agendamentoReativado = await agendamentoService.reativar(id);
        res.status(200).json(agendamentoReativado);
    } catch (error) {
        next(error);
    }
};

export {
    listarTodos,
    buscarUm,
    criarUm,
    atualizarUm,
    desativarUm,
    reativarUm
};