import * as usuarioRepository from '../repository/usuarioRepository.js';
// O caminho foi corrigido de '../error/ApiError.js' para o local correto.
import { ApiError } from '../../utils/ApiError.js';

async function listar() {
    return await usuarioRepository.listar();
}

async function buscarPorId(id) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de usuário inválido.');
    }
    
    const usuario = await usuarioRepository.buscarPorId(idNumerico);
    if (!usuario) {
        throw new ApiError(404, 'Usuário não encontrado.');
    }
    return usuario;
}

async function atualizar(id, dadosAtualizados) {
    const idNumerico = Number(id);
     if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de usuário inválido.');
    }
    
    const usuarioExistente = await usuarioRepository.buscarPorId(idNumerico);
    if (!usuarioExistente) {
        throw new ApiError(404, 'Usuário não encontrado para atualizar.');
    }
    if (!usuarioExistente.ativo) {
        throw new ApiError(403, 'Não é possível atualizar um usuário inativo.');
    }

    const usuarioAtualizado = await usuarioRepository.atualizar(idNumerico, dadosAtualizados);
    
    return usuarioAtualizado;
}

// A função agora desativa o usuário
async function deletar(id) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de usuário inválido.');
    }

    const sucesso = await usuarioRepository.desativar(idNumerico);
    if (!sucesso) {
        throw new ApiError(404, 'Usuário não encontrado para desativar.');
    }
    
    return;
}

async function reativar(id) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de usuário inválido.');
    }

    const sucesso = await usuarioRepository.reativar(idNumerico);
    if (!sucesso) {
        throw new ApiError(404, 'Usuário não encontrado para reativar.');
    }
    
    // Retorna o usuário completo após a reativação
    return await usuarioRepository.buscarPorId(idNumerico);
}

export {
    listar,
    buscarPorId,
    atualizar,
    deletar,
    reativar
};
