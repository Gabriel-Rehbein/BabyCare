import * as agendamentoRepository from '../repository/agendamentoRepository.js';
import * as monitoriaRepository from '../repository/monitoriaRepository.js';
import pool from '../../config/database.js';
import * as usuarioRepository from '../repository/usuarioRepository.js';
import { ApiError } from '../../utils/ApiError.js';

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

async function criar(dadosAgendamento) {
    const { monitoria_id, aluno_id, data_hora_inicio, data_hora_fim } = dadosAgendamento;

    // 1. Validação de campos obrigatórios
    if (!monitoria_id || !aluno_id || !data_hora_inicio || !data_hora_fim) {
        throw new ApiError(400, 'ID da monitoria, ID do aluno, data de início e data de fim são obrigatórios.');
    }

    // 2. Valida se a monitoria referenciada existe e está ativa
    const monitoria = await monitoriaRepository.buscarPorId(monitoria_id);
    if (!monitoria) {
        throw new ApiError(404, 'A monitoria especificada não foi encontrada.');
    }
    if (monitoria.status !== 'ativa') {
        throw new ApiError(403, 'Não é possível agendar uma monitoria que não está ativa.');
    }

    // 3. Valida se o aluno referenciado existe e está ativo
    const aluno = await usuarioRepository.buscarPorId(aluno_id);
    if (!aluno) {
        throw new ApiError(404, 'O aluno especificado não foi encontrado.');
    }
    if (!aluno.ativo) {
        throw new ApiError(403, 'Não é possível realizar um agendamento para um aluno inativo.');
    }

    // 4. Validação da lógica de datas
    const inicio = new Date(data_hora_inicio);
    const fim = new Date(data_hora_fim);

    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
        throw new ApiError(400, 'Formato de data inválido.');
    }

    if (inicio >= fim) {
        throw new ApiError(400, 'A data de início deve ser anterior à data de fim.');
    }

    if (inicio < new Date()) {
        throw new ApiError(400, 'Não é possível criar um agendamento no passado.');
    }

    const novoAgendamento = await agendamentoRepository.criar(dadosAgendamento);
    return novoAgendamento;
}

/**
 * Atualiza os dados de um agendamento específico no banco de dados.
 * @param {number} id O ID do agendamento a ser atualizado.
 * @param {object} dadosParaAtualizar Um objeto contendo os campos a serem atualizados.
 * @returns {Promise<object|null>} O objeto do agendamento atualizado.
 */
async function atualizar(id, dadosParaAtualizar) {
    // Define os campos que podem ser alterados na tabela de agendamento.
    const camposPermitidos = ['data_hora_inicio', 'data_hora_fim', 'observacoes'];
    const dadosParaSet = {};

    // Filtra apenas os campos permitidos que foram enviados na requisição.
    camposPermitidos.forEach(chave => {
        if (dadosParaAtualizar[chave] !== undefined) {
            dadosParaSet[chave] = dadosParaAtualizar[chave];
        }
    });

    // Se nenhum campo válido foi enviado, apenas retorna o registro como está.
    if (Object.keys(dadosParaSet).length === 0) {
        return await buscarPorId(id);
    }

    // Utiliza a interpolação de objeto do mysql2 para montar a cláusula SET de forma segura.
    const sql = 'UPDATE agendamento SET ? WHERE id = ?';
    
    await pool.query(sql, [dadosParaSet, id]);

    // Retorna o registro atualizado para confirmar a alteração.
    return await buscarPorId(id);
}

async function desativar(id) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de agendamento inválido.');
    }

    const sucesso = await agendamentoRepository.desativar(idNumerico);
    if (!sucesso) {
        throw new ApiError(404, 'Agendamento não encontrado para desativar.');
    }
    
    return;
}

async function reativar(id) {
    const idNumerico = Number(id);
    if (!idNumerico || !Number.isInteger(idNumerico)) {
        throw new ApiError(400, 'ID de agendamento inválido.');
    }

    const sucesso = await agendamentoRepository.reativar(idNumerico);
    if (!sucesso) {
        throw new ApiError(404, 'Agendamento não encontrado para reativar.');
    }
    
    // Retorna o usuário completo após a reativação
    return await agendamentoRepository.buscarPorId(idNumerico);
}

export {
    listar,
    buscarPorId,
    criar,
    atualizar,
    desativar,
    reativar
};