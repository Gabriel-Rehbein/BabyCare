import * as monitoriaService from '../services/monitoriaService.js';
import { validationResult } from 'express-validator';

// Controller para listar todos os usuários ativos
const listarTodas = async (req, res, next) => {
    try {
        const monitorias = await monitoriaService.listar();
        res.status(200).json(monitorias);
    } catch (error) {
        next(error);
    }
};

const buscarUma = async (req, res, next) => {
    try {
        const { id } = req.params;
        const monitoria = await monitoriaService.buscarPorId(id);
        res.status(200).json(monitoria);
    } catch (error) {
        next(error);
    }
};

export {
    listarTodas,
    buscarUma
};