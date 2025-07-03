const pool = require('../../config/database');

async function criar(usuario) {
    const { nome, email, googleId, tipo, curso } = usuario;
    const sql = 'INSERT INTO Usuario (nome, email, googleId, tipo, curso) VALUES (?, ?, ?, ?, ?)';
    try {
        console.log('REPOSITÓRIO: Executando a query SQL...');
        const [result] = await pool.execute(sql, [nome, email, googleId, tipo, curso]);
        return {id: result.insertId, ...usuario};
    } catch (error) {
        console.error('Erro no repositório ao criar usuário: ', error);
        throw error;
    }
}

async function listar() {
    const sql = 'SELECT id, nome, email, tipo FROM Usuario ORDER BY nome ASC';
    
    try {
        const [rows] = await pool.execute(sql);
        return rows;
    } catch (error) {
        // Este erro será capturado e enviado para o Service
        console.error('ERRO NO REPOSITÓRIO ao listar usuários: ', error.message); 
        throw error;
    }
}

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
    buscarPorGoogleId
};