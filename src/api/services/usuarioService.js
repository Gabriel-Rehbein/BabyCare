const usuarioRepository = require('../repository/usuarioRepository');

async function buscarPorId() {
    try{

        const usuario = await usuarioRepository.buscarPorId();

        if(usuario) {
            return usuario;
        }else{
            throw {id: 404, msg: "Usuário não encontrado."}
        }

    } catch(error) {
        console.error('SERVICE ERROR:', error);
        throw new Error(`Erro na camada de serviço: ${error.message}`);
    }
}

async function listarUsuarios() {
    try {
        console.log('SERVICE: Chamando o repositório para listar usuários...');
        const usuarios = await usuarioRepository.listar();
        return usuarios;
    } catch (error) {
        // Log do erro original completo no console para depuração
        console.error('ERRO DETALHADO NO SERVICE:', error); 
        
        // CORREÇÃO: Crie uma nova mensagem de erro que inclua a mensagem do erro original
        throw new Error(`Erro na camada de serviço: ${error.message}`);
    }
}

async function criarUsuario(usuario) {
    try {
        console.log('Oi');
    }catch (error) {
        
    }
};

module.exports = {
    buscarPorId,
    listarUsuarios
};