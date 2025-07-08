import * as monitoriaRepository from '../repository/monitoriaRepository.js';
import { ApiError } from '../../utils/ApiError.js';

async function listar() {
    return await monitoriaRepository.listar();
}

async function buscarPorId(id) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de usuário inválido.');
    }

    const monitoria = await monitoriaRepository.buscarPorId(idNumerico);
    if (!monitoria) {
        throw new ApiError(404, 'Monitoria não encontrada.');
    }
    return monitoria;
}

/**
 * Atualiza os dados de uma monitoria.
 * @param {string|number} id O ID da monitoria.
 * @param {object} dadosAtualizados Os dados a serem atualizados.
 * @returns {Promise<object>} O objeto da monitoria atualizada.
 * @throws {ApiError} Lança um erro se o ID for inválido, a monitoria não for encontrada ou não estiver ativa.
 */
async function atualizar(id, dadosAtualizados) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de monitoria inválido.');
    }

    const monitoriaExistente = await monitoriaRepository.buscarPorId(idNumerico);
    if (!monitoriaExistente) {
        throw new ApiError(404, 'Monitoria não encontrada para atualizar.');
    }

    if (monitoriaExistente.status !== 'ativa') {
        throw new ApiError(403, 'Não é possível atualizar uma monitoria que não esteja ativa.');
    }

    const monitoriaAtualizada = await monitoriaRepository.atualizar(idNumerico, dadosAtualizados);
    return monitoriaAtualizada;
}

export {
    listar,
    buscarPorId,
    atualizar
};