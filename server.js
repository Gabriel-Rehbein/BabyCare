const app = require('./app');
const pool = require('./src/config/database'); // Importe o pool de conexões

const PORT = process.env.port || 3000;

// Função para iniciar o servidor
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}.`);
        console.log(`Acesso http://localhost:${PORT} para testar sua conexão.`);
    });
};

// Tente conectar ao banco de dados antes de iniciar o servidor
pool.getConnection()
    .then(connection => {
        console.log('Conexão com o banco de dados bem-sucedida.');
        connection.release(); // Libere a conexão de volta para o pool
        startServer(); // Inicie o servidor se a conexão for bem-sucedida
    })
    .catch(error => {
        console.error('####################################################');
        console.error('ERRO: Não foi possível conectar ao banco de dados.');
        console.error('Verifique se o serviço MySQL está em execução e se as credenciais em src/config/database.js estão corretas.');
        console.error('Detalhes do erro:', error.message);
        console.error('####################################################');
        process.exit(1); // Saia do processo com um código de erro
    });