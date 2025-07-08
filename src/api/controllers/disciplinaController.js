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

export {
    listarTodas,
    buscarUma
};