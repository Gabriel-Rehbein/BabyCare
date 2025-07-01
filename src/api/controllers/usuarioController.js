const pool = require('../../config/database');

//POST
exports.createUser = async (req, res) => {
    //Corpo da requisição
    const { nome, email, senha, tipo, curso } = req.body;

    if ( !nome || !email || !senha || !tipo ) {
        return res.status(400).json({
            status: 'error',
            message: 'Os campos nome, email, senha e tipo são obrigatórios.'
        });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO Usuario (nome, email, senha_hash, tipo, curso) VALUES (?, ?, ?, ?, ?)',
            [nome, email, senha, tipo, curso]
        );

        res.status(201).json({
            status: 'success',
            message: 'Usuário criado com sucesso',
            data: {
                id: result.insertId,
                nome,
                email,
                tipo
            }
        });

    } catch (error) {
        console.error(error);

        if(error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                message: 'Este e-mail já está cadastrado.'
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Ocorreu um erro no servidor'
        });
    }
};

//GET
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nome, email, tipo, curso, criado_em FROM Usuario');

        res.status(200).json({
            status: 'success',
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Ocorreu um erro ao buscar os usuários. '});
    }
};

//GET /:id
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    //Implementar a lógica
    // Corrigi o erro de digitação de "stauts" para "status"
    res.status(200).json({ message: `Lógica para buscar usuário com ID ${id}` });
};

//Controller para atualizar um usuário
//PUT /:id
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nome, curso } = req.body;
    //Implementar a lógica para atualizar um usuário no banco.
    res.status(200).json({ message: `Lógica para atualizar um usuário com ID ${id}` });
};

//Controller para deletar um usuário
//DELETE /:id
exports.deleteUser =  async (req, res) => {
    const { id } = req.params;
    //Implementar a lógica para deletar um usuário no banco com ID.
    res.status(200).json({ message: `Lógica para deletar usuário com ID ${id} `});
};