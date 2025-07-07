import * as usuarioService from '../services/usuarioService.js';
import { validationResult } from 'express-validator';

// Controller para listar todos os usuários ativos
const listarTodos = async (req, res, next) => {
    try {
        const usuarios = await usuarioService.listar();
        res.status(200).json(usuarios);
    } catch (error) {
        next(error);
    }
};

// Controller para buscar um usuário específico pelo ID
const buscarUm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.buscarPorId(id);
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};

// Controller para atualizar os dados de um usuário
const atualizarUm = async (req, res, next) => {
    // Verifica se houve erros de validação (definidos na rota)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;
        const usuarioAtualizado = await usuarioService.atualizar(id, dadosAtualizados);
        res.status(200).json(usuarioAtualizado);
    } catch (error) {
        next(error);
    }
};

// Controller para desativar (soft delete) um usuário
const deletarUm = async (req, res, next) => {
    try {
        const { id } = req.params;
        await usuarioService.deletar(id);
        // Resposta 204 No Content é o padrão para DELETE bem-sucedido
        res.status(204).send(); 
    } catch (error) {
        next(error);
    }
};

const reativarUm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuarioReativado = await usuarioService.reativar(id);
        res.status(200).json(usuarioReativado);
    } catch (error) {
        next(error);
    }
};

// Exporta todas as funções do controller
export {
    listarTodos,
    buscarUm,
    atualizarUm,
    deletarUm,
    reativarUm
};