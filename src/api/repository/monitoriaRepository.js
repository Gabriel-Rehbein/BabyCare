import pool from '../../config/database.js';

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

async function atualizar(id, dadosParaAtualizar) {
    const camposPermitidos = ['horarios_disponiveis', 'local', 'status']; // Apenas campos que o usuário pode mudar
    const camposParaQuery = [];
    const valoresParaQuery = [];

    camposPermitidos.forEach(chave => {
        if (dadosParaAtualizar[chave] !== undefined) {
            const valor = typeof dadosParaAtualizar[chave] === 'object'
                ? JSON.stringify(dadosParaAtualizar[chave])
                : dadosParaAtualizar[chave];
                
            camposParaQuery.push(`${chave} = ?`);
            valoresParaQuery.push(valor);
        }
    });

    if (camposParaQuery.length === 0) {
        return await buscarPorId(id);
    }

    valoresParaQuery.push(id);

    const sql = `UPDATE Monitoria SET ${camposParaQuery.join(', ')} WHERE id = ?`;
    valoresParaQuery.push(id);

    const [result] = await pool.execute(sql, valoresParaQuery);

    if (result.affectedRows === 0) {
        return null;
    }

    return await buscarPorId(id);
}

export {
    listar,
    buscarPorId,
    atualizar
};