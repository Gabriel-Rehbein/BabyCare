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

async function atualizar(id, dados) {
    try {
        console.log('Oi');
    }catch (error) {
        
    }
};

/**
 * Remove um usuário do sistema.
 * Verifica primeiro se o usuário existe antes de tentar a remoção.
 * @param {number} id - O ID do usuário a ser removido.
 * @returns {Promise<void>} Retorna uma promessa vazia em caso de sucesso.
 * @throws {ApiError} Lança um erro se o usuário não for encontrado ou se ocorrer uma falha.
 */
async function remover(id) {
    try {
        const usuario = await usuarioRepository.buscarPorId(id);

        if (!usuario) {
            throw new ApiError(404, "Usuário não encontrado. Nenhum registro foi removido.")
        }

        await usuarioRepository.remover(id);

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.error(`Erro no serviço ao remover usuário ID ${id}:`, error);
        throw new Error('Ocorreu uma falha no servidor ao tentar remover o usuário.');
    }
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