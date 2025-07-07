import mysql from 'mysql2/promise';
import 'dotenv/config'; // Garante que as variáveis de ambiente sejam carregadas

// Configuração da conexão com o MySQL usando um pool de conexões
// É uma boa prática usar variáveis de ambiente para as credenciais do banco.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'monitoria_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
