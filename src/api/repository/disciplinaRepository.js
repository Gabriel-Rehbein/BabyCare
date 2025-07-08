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

async function criar(disciplina) {
    const { nome, codigo } = disciplina;

    const sql = `
        INSERT INTO Disciplina (nome, codigo) 
        VALUES (?, ?)
    `;
    
    const [result] = await pool.execute(sql, [nome, codigo]);
    
    return await buscarPorId(result.insertId);
}

/**
 * Atualiza os dados de uma disciplina específica no banco de dados.
 * @param {number} id O ID da disciplina a ser atualizada.
 * @param {object} dadosParaAtualizar Um objeto contendo os campos 'nome' e/ou 'codigo'.
 * @returns {Promise<object|null>} O objeto da disciplina atualizada.
 */
async function atualizar(id, dadosParaAtualizar) {
    // Define os campos que podem ser alterados na tabela Disciplina.
    const camposPermitidos = ['nome', 'codigo'];
    const dadosParaSet = {};

    // Filtra apenas os campos permitidos que foram enviados na requisição.
    camposPermitidos.forEach(chave => {
        if (dadosParaAtualizar[chave] !== undefined) {
            dadosParaSet[chave] = dadosParaAtualizar[chave];
        }
    });

    // Se nenhum campo válido foi enviado para atualização, apenas retorna o registro como está.
    if (Object.keys(dadosParaSet).length === 0) {
        return await buscarPorId(id);
    }

    // Utiliza a interpolação de objeto do mysql2 para montar a cláusula SET de forma segura.
    const sql = 'UPDATE Disciplina SET ? WHERE id = ?';
    
    await pool.query(sql, [dadosParaSet, id]);

    // Retorna o registro atualizado para confirmar a alteração.
    return await buscarPorId(id);
}

/**
 * Exclui permanentemente uma disciplina do banco de dados com base no ID.
 * @param {number} id O ID da disciplina a ser excluída.
 * @returns {Promise<boolean>} Retorna true se a exclusão foi bem-sucedida, false caso contrário.
 */
async function remover(id) {
    const sql = 'DELETE FROM Disciplina WHERE id = ?';

    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
}

export {
    listar,
    criar,
    atualizar,
    buscarPorId,
    remover
};