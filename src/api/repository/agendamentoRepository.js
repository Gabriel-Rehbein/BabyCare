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

export {
    listar,
    buscarPorId
};