import * as agendamentoRepository from '../repository/agendamentoRepository.js';

async function listar() {
    return await agendamentoRepository.listar();
}

async function buscarPorId(id) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de usuário inválido.');
    }
    
    const agendamento = await agendamentoRepository.buscarPorId(idNumerico);
    if (!agendamento) {
        throw new ApiError(404, 'Agendamento não encontrada.');
    }
    return agendamento;
}

export {
    listar,
    buscarPorId
};