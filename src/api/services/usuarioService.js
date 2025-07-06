const ApiError = require('../../utils/ApiError');
const usuarioRepository = require('../repository/usuarioRepository');
const bcrypt = require('bcrypt');

async function listar() {
    try{
        const usuarios = await usuarioRepository.listar();

        return usuarios || [];
    } catch (error) {
        console.error("Erro no serviço ao lista usuários:", error);
        throw new Error('Ocorreu um erro no servidor ao buscar a lista de usuários.');
    }
};

/**
 * Cria um novo usuário no sistema.
 * Valida os dados, verifica a existência do email e criptografa a senha antes de salvar.
 * @param {object} dadosUsuario - Objeto contendo os dados do novo usuário { nome, email, senha, tipo, ... }.
 * @returns {Promise<object>} Retorna o objeto do usuário recém-criado (sem a senha).
 * @throws {ApiError} Lança um erro se os dados forem inválidos, o email já existir, ou outra falha ocorrer.
 */
async function criar(dadosUsuario) {
    const {nome, email, senha, tipo} = dadosUsuario;

    if (!nome || !email || !senha ) {
        throw new ApiError(400, "Nome, e-mail e senha são campos obrigatórios.");
    }

    try {
        const usuarioExistente = await usuarioRepository.buscarPorEmail(email);
        if (usuarioExistente) {
            throw new ApiError(409, "O e-mail fornecido já está cadastrado.");
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuarioParaSalvar = {
            nome,
            email, 
            senha: senhaHash,
            tipo: tipo || 'aluno'
        };

        const usuarioCriado = await usuarioRepository.criar(novoUsuarioParaSalvar);
        delete usuarioCriado.senha;

        return usuarioCriado;

    }catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error.code === 'ER_DUP_ENTRY') {
            throw new ApiError(409, 'O e-mail fornecido já está cadastrado.');
        }

        console.error("Erro no serviço ao criar usuário: ", error);
        throw new Error('Ocorreu uma falha no servidor ao tentar criar o usuário.');
    }
};

async function buscarPorId(id) {
    try{
        const usuario = await usuarioRepository.buscarPorId(id);

        if(!usuario) {
            throw new ApiError(404, "Usuário não encontrado.");
        }

        return usuario
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.error(`Erro no serviço ao buscar usuário por ID ${id}: `, error);
        throw new Error('Ocorreu um erro no servidor ao processar sua solicitação.');
    }
};

async function buscarPorEmail(email) {
    try {
        const usuario = await usuarioRepository.buscarPorEmail(email);

        if (!usuario) {
            throw new ApiError(404, "Usuário não encontrado.");
        }
        return usuario;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.error(`Erro no serviço ao buscar usuário pelo e-mail ${email}: `, error);
        throw new Error('Ocorreu um erro no servidor ao processar sua solicitação.');
    }
}

async function buscarPorGoogleId(id) {
    try{
        const usuario = await usuarioRepository.buscarPorId(id);

        if(!usuario) {
            throw new ApiError(404, "Usuário não encontrado.");
        }

        return usuario
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.error(`Erro no serviço ao buscar usuário por ID ${id}: `, error);
        throw new Error('Ocorreu um erro no servidor ao processar sua solicitação.');
    }
};

async function atualizar(id, dadosAtualizados) {
    const numericId = Number(id);
    if (!numericId || !Number.isInteger(numericId) || numericId <= 0) {
        throw new ApiError(404, "O ID do usuário fornecido é inválido.");
    }

    const usuarioExistente = await usuarioRepository.buscarPorId(id);
    if(!usuarioExistente) {
        throw new Error('Usuário não encontrado.');
    }

    const dadosParaAtualizar = dadosAtualizados;
    if (Object.keys(dadosParaAtualizar.length === 0)) {
        throw new ApiError(400, 'Nenhum dado fornecido para atualização.');
    }

    const usuarioAtualizado = await usuarioRepository.atualizar(idNumerico, dadosParaAtualizar);

    return usuarioAtualizado;
};

/**
 * Remove um usuário do sistema.
 * @param {number} id - O ID do usuário a ser removido.
 * @returns {Promise<void>} Retorna uma promessa vazia em caso de sucesso.
 * @throws {ApiError} Lança um erro se o usuário não for encontrado ou se ocorrer uma falha.
 */
async function remover(id) { 
    const idNumerico = Number(id);

    if(!idNumerico || !Number.isInteger(idNumerico) || idNumerico <= 0) {
        throw new ApiError(400, "O ID do usuário fornecido é inválido.");
    }
    const usuario = await usuarioRepository.buscarPorId(id);

    if(!usuario) {
        throw new ApiError(404, "Usuário não encontrado.");
    }

    await usuarioRepository.remover(id);
};

module.exports = {
    listar,
    criar,
    buscarPorId,
    buscarPorEmail,
    buscarPorGoogleId,
    atualizar,
    remover
};