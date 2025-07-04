const pool = require('../../config/database');

/**
 * Busca todos os usuários no banco de dados, ordenados por nome.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de usuários.
 */
async function listar() {
    const sql = 'SELECT id, nome, email, tipo FROM Usuario ORDER BY nome ASC';
    
    const [rows] = await pool.execute(sql);
    return rows;
};

/**
 * Insere um novo usuário no banco de dados.
 * @param {object} usuario - O objeto do usuário contendo { nome, email, googleId, tipo }.
 * @returns {Promise<object>} Uma promessa que resolve para o objeto do novo usuário criado, incluindo seu ID.
 */
async function criar(usuario) {
    const { nome, email, googleId, tipo } = usuario;
    const sql = 'INSERT INTO Usuario (nome, email, googleId, tipo) VALUES (?, ?, ?, ?)';
    
    const [result] = await pool.execute(sql, [nome, email, googleId, tipo]);
    return { id: result.insertId, ...usuario };
};

/**
 * Busca um usuário específico pelo seu ID.
 * @param {number} id - O ID do usuário a ser buscado.
 * @returns {Promise<object|undefined>} Uma promessa que resolve para o objeto do usuário ou undefined se não for encontrado.
 */
async function buscarPorId(id) {
    const sql = 'SELECT id, nome, email, googleId, tipo FROM Usuario WHERE id = ?';
    const [rows] = await pool.execute(sql, [id]);

    return rows[0];
};

/**
 * Busca um usuário específico pelo seu email.
 * @param {string} email - O email do usuário a ser buscado.
 * @returns {Promise<object|undefined>} Uma promessa que resolve para o objeto do usuário ou undefined se não for encontrado.
 */
async function buscarPorEmail(email) {
    const sql = 'SELECT id, nome, email, googleId, tipo FROM Usuario WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0];
};

async function buscarPorGoogleId(googleId) {
    const sql = 'SELECT * FROM Usuario WHERE googleId = ?';

    const [rows] = await pool.execute(sql, [googleId]);
    return rows[0];
};

/**
 * Atualiza os dados de um usuário no banco de dados.
 * A função constrói a query dinamicamente para atualizar apenas os campos fornecidos.
 * @param {number} id - O ID do usuário a ser atualizado.
 * @param {object} dadosParaAtualizar - Um objeto contendo os campos a serem atualizados. Ex: { nome: "Novo Nome", tipo: "monitor" }.
 * @returns {Promise<object>} Uma promessa que resolve para o objeto de resultado da query.
 */
async function atualizar(id, dadosParaAtualizar) {
    if (!Number.isInteger(id)) {
        throw new Error("ID inválido");
    }

    const camposValidos = ['nome', 'email', 'tipo'];
    const camposParaQuery = [];
    const valoresParaQuery = [];

    for (const chave of camposValidos) {
        if (dadosParaAtualizar[chave] !== undefined) {
            camposParaQuery.push(`${chave} = ?`);
            valoresParaQuery.push(dadosParaAtualizar[chave]);
        }
    }

    if (valoresParaQuery.length === 0) {
        return { changedRows: 0 };
    }
    
    valoresParaQuery.push(id);
    const sql = `UPDATE Usuario SET ${camposParaQuery.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.execute(sql, valoresParaQuery);
    return result;
}

/**
 * Remove um usuário do banco de dados pelo seu ID.
 * @param {number} id - O ID do usuário a ser removido.
 * @returns {Promise<object>} Uma promessa que resolve para o objeto de resultado da query.
 */
async function remover(id) {
    const sql = 'DELETE FROM Usuario WHERE id = ?';

    const [result] = await pool.execute(sql, [id]);
    return result;
}

module.exports = {
    listar,
    criar,
    buscarPorId,
    buscarPorEmail,
    buscarPorGoogleId,
    atualizar,
    remover
};