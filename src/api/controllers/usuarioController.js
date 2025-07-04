const usuarioService = require('../services/usuarioService');

const listarUsuarios = async (req, res, next) => {
    try {
        const usuarios = await usuarioService.listarUsuarios();
        res.status(200).json(usuarios);

    } catch(error) {
        res.status(500).json({message: "Ocorreu um erro ao buscar os usuários.", error: error.message});
    }
};

const criarUsuario = async (req, res, next) => {
    try {

    } catch (error) {

    }
};

const buscarUsuarioPorId = async (req, res, next) => {
    try {
        const {id} = req.params;
        const usuario = await usuarioService.buscarPorId(id);
        res.status(200).json(usuario);
    } catch(error) {
        next(error);
    }
};

const buscarUsuarioPorEmail = async (req, res, next) => {
    try {
        const {email} = req.params;
        const usuario = await usuarioService.buscarPorEmail(email);
        res.status(200).json(usuario);
    } catch(error) {
        next(error);
    }
};

const buscarUsuarioPorGoogleId = async (req, res, next) => {
    try {

    } catch (error) {

    }
};

const atualizarUsuario = async (req, res, next) => {
    try {

    } catch (error) {

    }
};

const removerUsuario = async (req, res, next) => {
    try {

    } catch (error) {

    }
};

module.exports = {
    listarUsuarios,
    criarUsuario,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    buscarUsuarioPorGoogleId,
    atualizarUsuario,
    removerUsuario
};