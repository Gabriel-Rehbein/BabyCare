import * as disciplinaRepository from '../repository/disciplinaRepository.js';

async function listar() {
    return await disciplinaRepository.listar();
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

export {
    listar,
    buscarPorId
};