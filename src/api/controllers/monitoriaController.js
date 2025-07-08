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

const atualizarUma = async (req, res, next) => {
    // 1. Verifica se a validação da rota (definida em monitoriaRoutes.js) encontrou erros.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Se houver erros, retorna uma resposta 400 (Bad Request) com a lista de erros.
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        // 2. Extrai o ID dos parâmetros da rota e os dados do corpo da requisição.
        const { id } = req.params;
        const dadosAtualizados = req.body;

        // 3. Chama a camada de serviço para executar a lógica de atualização.
        const monitoriaAtualizada = await monitoriaService.atualizar(id, dadosAtualizados);
        
        // 4. Retorna a monitoria atualizada com o status 200 (OK).
        res.status(200).json(monitoriaAtualizada);
    } catch (error) {
        // 5. Se ocorrer qualquer erro lançado pela camada de serviço (ex: 404, 403),
        // ele é capturado e passado para o middleware de tratamento de erros.
        next(error);
    }
};

export {
    listarTodas,
    buscarUma,
    atualizarUma
};