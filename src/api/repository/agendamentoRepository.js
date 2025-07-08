import pool from '../../config/database.js';

async function buscarPorId(id) {
    if (!id || !Number.isInteger(Number(id))) return null;
    
    const [linhas] = await pool.query('SELECT * FROM Agendamento WHERE id = ?', [id]);
    return linhas[0] || null;
}

async function listar() {
    const sql = `
        SELECT
            a.id AS agendamento_id,
            a.data_hora_inicio,
            a.data_hora_fim,
            a.status,
            a.observacoes,
            aluno.nome AS nome_aluno,       -- Busca o nome do aluno da tabela Usuario
            monitor.nome AS nome_monitor,   -- Busca o nome do monitor da tabela Usuario
            d.nome AS nome_disciplina       -- Busca o nome da disciplina da tabela Disciplina
        FROM Agendamento AS a
        -- Junta com a tabela Usuario para pegar o nome do aluno
        JOIN Usuario AS aluno ON a.aluno_id = aluno.id
        -- Junta com a tabela Monitoria para descobrir quem é o monitor
        JOIN Monitoria AS m ON a.monitoria_id = m.id
        -- Junta com a tabela Usuario novamente (com um apelido diferente) para pegar o nome do monitor
        JOIN Usuario AS monitor ON m.monitor_id = monitor.id
        -- Junta com a tabela Disciplina para pegar o nome da disciplina
        JOIN Disciplina AS d ON m.disciplina_id = d.id
        ORDER BY a.data_hora_inicio DESC; -- Ordena pelos mais recentes
    `;
    const [linhas] = await pool.query(sql);
    return linhas;
}

/**
 * Cria um novo registro de agendamento no banco de dados.
 * @param {object} agendamento O objeto contendo os dados do novo agendamento.
 * @returns {Promise<object>} O objeto do agendamento recém-criado.
 */
async function criar(agendamento) {
    // Extrai os campos necessários do objeto de agendamento.
    const { 
        monitoria_id, 
        aluno_id, 
        data_hora_inicio, 
        data_hora_fim, 
        observacoes 
    } = agendamento;

    // O campo 'status' terá seu valor padrão 'confirmado' definido pelo banco de dados.
    const sql = `
        INSERT INTO agendamento (monitoria_id, aluno_id, data_hora_inicio, data_hora_fim, observacoes) 
        VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(sql, [
        monitoria_id, 
        aluno_id, 
        data_hora_inicio, 
        data_hora_fim, 
        observacoes || null 
    ]);
    
    return await buscarPorId(result.insertId);
}

/**
 * Atualiza os dados de um agendamento específico no banco de dados.
 * @param {number} id O ID do agendamento a ser atualizado.
 * @param {object} dadosParaAtualizar Um objeto contendo os campos a serem atualizados.
 * @returns {Promise<object|null>} O objeto do agendamento atualizado.
 */
async function atualizar(id, dadosParaAtualizar) {
    // Define os campos que podem ser alterados na tabela de agendamento.
    const camposPermitidos = ['data_hora_inicio', 'data_hora_fim', 'status', 'observacoes'];
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

// Função de desativação (soft delete)
async function desativar(id) {
    const sql = `UPDATE agendamento SET status = cancelado WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
}

async function reativar(id) {
    const sql = `UPDATE monitoria SET status = confirmado WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
}

export {
    listar,
    buscarPorId,
    criar,
    atualizar,
    desativar,
    reativar
};