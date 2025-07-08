import pool from '../../config/database.js';

/**
 * Cria um novo registro de monitoria no banco de dados.
 * @param {object} monitoria O objeto contendo os dados da nova monitoria.
 * @returns {Promise<object>} O objeto da monitoria recém-criada.
 */
async function criar(monitoria) {
    const { disciplina_id, monitor_id, horarios_disponiveis, local } = monitoria;

    // Converte o objeto de horários para uma string JSON antes de inserir no banco.
    const horariosJSON = horarios_disponiveis ? JSON.stringify(horarios_disponiveis) : null;

    const sql = `
        INSERT INTO Monitoria (disciplina_id, monitor_id, horarios_disponiveis, local) 
        VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(sql, [disciplina_id, monitor_id, horariosJSON, local]);
    
    // Retorna o registro completo da monitoria que acabou de ser criada.
    return await buscarPorId(result.insertId);
}

async function buscarPorId(id) {
    if (!id || !Number.isInteger(Number(id))) return null;

    const [linhas] = await pool.query('SELECT id, disciplina_id, monitor_id, horarios_disponiveis, local, status FROM Monitoria WHERE id = ?', [id]);
    return linhas[0] || null;
}

async function listar() {
    const sql = `
        SELECT
            m.id AS monitoria_id,
            m.horarios_disponiveis,
            m.local,
            m.status,
            u.nome AS nome_monitor,      -- Busca o nome do monitor da tabela Usuario
            d.nome AS nome_disciplina,   -- Busca o nome da disciplina da tabela Disciplina
            d.codigo AS codigo_disciplina
        FROM Monitoria AS m
        -- Junta com a tabela Usuario para obter o nome do monitor
        JOIN Usuario AS u ON m.monitor_id = u.id
        -- Junta com a tabela Disciplina para obter os detalhes da disciplina
        JOIN Disciplina AS d ON m.disciplina_id = d.id
        WHERE m.status = 'ativa' AND u.ativo = TRUE; -- Mostra apenas monitorias e monitores ativos
    `;
    const [linhas] = await pool.query(sql);
    return linhas;
}

/**
 * Atualiza os dados de uma monitoria específica no banco de dados.
 * @param {number} id O ID da monitoria a ser atualizada.
 * @param {object} dadosParaAtualizar Um objeto contendo os campos a serem atualizados.
 * @returns {Promise<object|null>} O objeto da monitoria atualizada.
 */
async function atualizar(id, dadosParaAtualizar) {
    const camposPermitidos = ['horarios_disponiveis', 'local', 'status'];
    const dadosParaSet = {};

    camposPermitidos.forEach(chave => {
        if (dadosParaAtualizar[chave] !== undefined) {
            if (chave === 'horarios_disponiveis' && typeof dadosParaAtualizar[chave] === 'object') {
                dadosParaSet[chave] = JSON.stringify(dadosParaAtualizar[chave]);
            } else {
                dadosParaSet[chave] = dadosParaAtualizar[chave];
            }
        }
    });

    if (Object.keys(dadosParaSet).length === 0) {
        return await buscarPorId(id);
    }

    const sql = 'UPDATE Monitoria SET ? WHERE id = ?';
    
    // CORREÇÃO: Trocado pool.execute() por pool.query().
    // O método query() suporta a interpolação de objetos para a cláusula SET,
    // enquanto o execute() não, o que causava o erro de sintaxe SQL.
    await pool.query(sql, [dadosParaSet, id]);

    // Retorna o registro atualizado para confirmar a alteração.
    return await buscarPorId(id);
}

// Função de desativação (soft delete)
async function desativar(id) {
    const sql = `UPDATE monitoria SET status = FALSE WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
}

async function reativar(id) {
    const sql = `UPDATE monitoria SET status = TRUE WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
}

export {
    listar,
    criar,
    buscarPorId,
    atualizar,
    desativar,
    reativar
};