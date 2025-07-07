import pool from '../../config/database.js';

// Helper para reutilizar a busca
async function buscarPorId(id) {
    if (!id || !Number.isInteger(Number(id))) return null;
    // Seleciona todas as colunas da nova tabela
    const [linhas] = await pool.query('SELECT id, googleId, nome, email, curso, semestre, tipo, ativo, criado_em, atualizado_em FROM Usuario WHERE id = ?', [id]);
    return linhas[0] || null;
}

async function listar() {
    // Retorna apenas usuários ativos e um conjunto limitado de colunas para a listagem geral
    const [linhas] = await pool.query('SELECT id, googleId, nome, email, curso, semestre, tipo, ativo, criado_em, atualizado_em FROM Usuario WHERE ativo = TRUE');
    return linhas;
}

async function atualizar(id, dadosParaAtualizar) {
    const camposPermitidos = ['nome', 'curso', 'semestre']; // Apenas campos que o usuário pode mudar
    const camposParaQuery = [];
    const valoresParaQuery = [];

    camposPermitidos.forEach(chave => {
        if (dadosParaAtualizar[chave] !== undefined) {
            camposParaQuery.push(`${chave} = ?`);
            valoresParaQuery.push(dadosParaAtualizar[chave]);
        }
    });

    if (camposParaQuery.length === 0) {
        return await buscarPorId(id);
    }

    const sql = `UPDATE Usuario SET ${camposParaQuery.join(', ')} WHERE id = ?`;
    valoresParaQuery.push(id);

    const [result] = await pool.execute(sql, valoresParaQuery);

    if (result.affectedRows === 0) {
        return null;
    }

    return await buscarPorId(id);
}

// Função de desativação (soft delete)
async function desativar(id) {
    const sql = `UPDATE Usuario SET ativo = FALSE WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
}

async function reativar(id) {
    const sql = `UPDATE Usuario SET ativo = TRUE WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
}

// Funções de autenticação
async function buscarPorGoogleId(googleId) {
    const [rows] = await pool.execute('SELECT * FROM Usuario WHERE googleId = ?', [googleId]);
    return rows[0];
}

async function criar(usuario) {
    const { nome, email, googleId } = usuario;
    // O banco de dados cuidará dos valores padrão para 'tipo', 'ativo', 'criado_em', 'atualizado_em'
    const sql = 'INSERT INTO Usuario (nome, email, googleId) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [nome, email, googleId]);
    return await buscarPorId(result.insertId);
}

export {
    listar,
    buscarPorId,
    atualizar,
    desativar,
    reativar,
    buscarPorGoogleId,
    criar
};