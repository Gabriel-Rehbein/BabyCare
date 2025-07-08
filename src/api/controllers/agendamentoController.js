import * as agendamentoService from '../services/agendamentoService.js';
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

const buscarUma = async (req, res, next) => {
    try {
        const { id } = req.params;
        const agendamento = await agendamentoService.buscarPorId(id);
        res.status(200).json(agendamento);
    } catch (error) {
        next(error);
    }
};

export {
    listarTodos,
    buscarUma
};