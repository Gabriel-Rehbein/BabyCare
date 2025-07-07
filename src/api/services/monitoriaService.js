import * as monitoriaRepository from '../repository/monitoriaRepository.js';

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

export {
    listar,
    buscarPorId
};