import * as monitoriaRepository from '../repository/monitoriaRepository.js';
import * as disciplinaRepository from '../repository/disciplinaRepository.js';
import * as usuarioRepository from '../repository/usuarioRepository.js';
import { ApiError } from '../../utils/ApiError.js';

/**
 * Valida os dados e cria uma nova monitoria.
 * @param {object} dadosMonitoria Os dados para a nova monitoria.
 * @returns {Promise<object>} O objeto da monitoria recém-criada.
 */
async function criar(dadosMonitoria) {
    const { disciplina_id, monitor_id, local } = dadosMonitoria;

    // 1. Validação de campos obrigatórios
    if (!disciplina_id || !monitor_id || !local) {
        throw new ApiError(400, 'ID da disciplina, ID do monitor e local são obrigatórios.');
    }

    // 2. Valida se a disciplina existe
    const disciplina = await disciplinaRepository.buscarPorId(disciplina_id);
    if (!disciplina) {
        throw new ApiError(404, 'A disciplina especificada não foi encontrada.');
    }

    // 3. Valida se o usuário (monitor) existe e está ativo
    const monitor = await usuarioRepository.buscarPorId(monitor_id);
    if (!monitor) {
        throw new ApiError(404, 'O usuário especificado como monitor não foi encontrado.');
    }
    if (!monitor.ativo) {
        throw new ApiError(403, 'O usuário especificado como monitor está inativo.');
    }

 if (monitor.tipo !== 'monitor') {
     throw new ApiError(403, 'O usuário especificado não tem permissão para ser monitor.');
 }
    const novaMonitoria = await monitoriaRepository.criar(dadosMonitoria);

    return novaMonitoria;
}

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

async function deletar(id) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de monitoria inválido.');
    }

    const sucesso = await monitoriaRepository.desativar(idNumerico);
    if (!sucesso) {
        throw new ApiError(404, 'Monitoria não encontrada para desativar.');
    }
    
    return;
}

async function reativar(id) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de monitoria inválido.');
    }

    const sucesso = await monitoriaRepository.reativar(idNumerico);
    if (!sucesso) {
        throw new ApiError(404, 'Monitoria não encontrada para reativar.');
    }
    
    // Retorna o usuário completo após a reativação
    return await monitoriaRepository.buscarPorId(idNumerico);
}

export {
    listar,
    criar,
    buscarPorId,
    atualizar,
    deletar,
    reativar
};