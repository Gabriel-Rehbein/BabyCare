const usuarioService = require('../services/usuarioService');

const buscarPorId = async (req, res) => {
    try {

        const usuario = await usuarioService.buscarPorId();
        res.status(200).json(usuario);

    } catch(error) {
        res.status(500).json({message: "Ocorreu um erro ao buscar o usuário.", error: error.message});
    }
};

const getAllUsers = async (req, res) => {
    try {

        const usuarios = await usuarioService.listarUsuarios();
        res.status(200).json(usuarios);

    } catch(error) {
        res.status(500).json({message: "Ocorreu um erro ao buscar os usuários.", error: error.message});
    }
};

module.exports = {
    buscarPorId,
    getAllUsers
};