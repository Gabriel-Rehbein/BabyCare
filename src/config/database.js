//Configuração da conexão com o MySQL

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'monitoria_db'
});

module.exports = pool;