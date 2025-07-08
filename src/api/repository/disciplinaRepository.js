import pool from '../../config/database.js';

async function buscarPorId(id) {
    if (!id || !Number.isInteger(Number(id))) return null;
    
    const [linhas] = await pool.query('SELECT * FROM Disciplina WHERE id = ?', [id]);
    return linhas[0] || null;
}

async function listar() {
    const [linhas] = await pool.query('SELECT * FROM Disciplina');
    return linhas;
}

export {
    listar,
    buscarPorId
};