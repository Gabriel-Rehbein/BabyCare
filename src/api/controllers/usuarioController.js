const usuarioService = require('../services/usuarioService');

const listarUsuarios = async (req, res, next) => {
    try {
        const usuarios = await usuarioService.listar();
        res.status(200).json(usuarios);

    } catch(error) {
        next(error);
    }
};

const criarUsuario = async (req, res, next) => {
    try {
        const {dados} = req.params;
        await usuarioService.criar(dados);
        res.status(200).json({message: `Criado usuário${dados}`});
    } catch (error) {
        next(error);
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
    const {email} = req.params;
    
    try {
        const usuario = await usuarioService.buscarPorEmail(email);
        res.status(200).json(usuario);
    } catch(error) {
        next(error);
    }
};

const buscarUsuarioPorGoogleId = async (req, res, next) => {
    const {googleId} = req.params;

    try {
        const usuario = await usuarioService.buscarPorGoogleId(googleId);
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};

const atualizarUsuario = async (req, res, next) => {
    try {
        const {id} = req.params;
        const dadosAtualizados = req.body;

        if(!id) {
            return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
        }

        const usuarioAtualizado = await usuarioService.atualizar(Number(id), dadosAtualizados);

        res.status(200).json(usuarioAtualizado);
    } catch (error) {
        next(error);
    }
};

const removerUsuario = async (req, res, next) => {
    try {
        const {id} = req.params;

        await usuarioService.remover(id);

        res.status(200).json({message: 'Usuário removido com sucesso'});
    } catch (error) {
        next(error);
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