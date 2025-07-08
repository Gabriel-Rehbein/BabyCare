import * as disciplinaRepository from '../repository/disciplinaRepository.js';
import { ApiError } from '../../utils/ApiError.js';

async function listar() {
    return await disciplinaRepository.listar();
}

/**
 * Valida os dados e cria uma nova disciplina.
 * @param {object} dadosDisciplina Os dados para a nova disciplina (nome, codigo).
 * @returns {Promise<object>} O objeto da disciplina recém-criada.
 * @throws {ApiError} Lança um erro se os dados forem inválidos.
 */
async function criar(dadosDisciplina) {
    const { nome, codigo } = dadosDisciplina;

    if (!nome || !codigo) {
        throw new ApiError(400, 'Nome e código da disciplina são obrigatórios.');
    }

    const novaDisciplina = await disciplinaRepository.criar(dadosDisciplina);
    return novaDisciplina;
}

/**
 * Atualiza os dados de uma disciplina.
 * @param {string|number} id O ID da disciplina.
 * @param {object} dadosAtualizados Os dados a serem atualizados.
 * @returns {Promise<object>} O objeto da disciplina atualizada.
 * @throws {ApiError} Lança um erro se o ID for inválido ou a disciplina não for encontrada.
 */
async function atualizar(id, dadosAtualizados) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de disciplina inválido.');
    }

    const disciplinaExistente = await disciplinaRepository.buscarPorId(idNumerico);
    if (!disciplinaExistente) {
        throw new ApiError(404, 'Disciplina não encontrada para atualizar.');
    }

    const disciplinaAtualizada = await disciplinaRepository.atualizar(idNumerico, dadosAtualizados);
    return disciplinaAtualizada;
}

async function buscarPorId(id) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de usuário inválido.');
    }
    
    const disciplina = await disciplinaRepository.buscarPorId(idNumerico);
    if (!disciplina) {
        throw new ApiError(404, 'Disciplina não encontrada.');
    }
    return disciplina;
}

async function remover(id) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de disciplina inválido.');
    }

    const sucesso = await disciplinaRepository.remover(idNumerico);
    if (!sucesso) {
        throw new ApiError(404, 'Disciplina não encontrada para desativar.');
    }
    
    return;
}

export {
    listar,
    criar,
    atualizar,
    buscarPorId,
    remover
};