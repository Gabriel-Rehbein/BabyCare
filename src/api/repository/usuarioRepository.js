// Removida a importação duplicada e não utilizada de 'db'
const pool = require('../../config/database');

/**
 * Cria um novo usuário no banco de dados.
 */
async function criar(usuario) {
    // CORREÇÃO: Removido o campo 'curso' da query, pois ele não está na lista de colunas.
    // Isso resolve o erro 'Column count doesn't match value count'.
    const { nome, email, googleId, tipo } = usuario;
    const sql = 'INSERT INTO Usuario (nome, email, googleId, tipo) VALUES (?, ?, ?, ?)';
    
    try {
        console.log('REPOSITÓRIO: Executando a query SQL de criação...');
        // CORREÇÃO: Passando apenas os valores que correspondem às colunas na query SQL.
        const [result] = await pool.execute(sql, [nome, email, googleId, tipo]);
        
        // Retorna o objeto do usuário recém-criado com o ID.
        return { id: result.insertId, nome, email, googleId, tipo };
    } catch (error) {
        console.error('Erro no repositório ao criar usuário: ', error);
        throw error;
    }
}

/**
 * Busca um usuário pelo seu ID.
 */
async function buscarPorId(id) { // CORREÇÃO: Adicionado o parâmetro 'id' que estava faltando.
    const sql = 'SELECT * FROM Usuario WHERE id = ?';
    try {
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    } catch (error) {
        console.error('ERRO NO REPOSITÓRIO ao buscar por ID: ', error);
        throw error;
    }
}

/**
 * Lista todos os usuários.
 */
async function listar() {
    const sql = 'SELECT id, nome, email, tipo FROM Usuario ORDER BY nome ASC';
    
    try {
        const [rows] = await pool.execute(sql);
        return rows;
    } catch (error) {
        console.error('ERRO NO REPOSITÓRIO ao listar usuários: ', error.message); 
        throw error;
    }
}

/**
 * Busca um usuário pelo seu googleId.
 */
async function buscarPorGoogleId(googleId) {
    const sql = 'SELECT * FROM Usuario WHERE googleId = ?';
    try {
        const [rows] = await pool.execute(sql, [googleId]);
        return rows[0];
    } catch (error) {
        console.error('ERRO NO REPOSITÓRIO ao buscar por Google ID: ', error);
        throw error;
    }
}

module.exports = {
    listar,
    criar,
    buscarPorId,
    buscarPorGoogleId
};