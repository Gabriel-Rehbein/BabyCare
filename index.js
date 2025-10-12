//carrega variaveis do .env
require('dotenv').config();
//Importação de pacotes
const express = require('express');
const cors = require('cors');

//Cria uma instancia do aplicativo Express
const app = express();

// 3. Configurar os Middlewares
app.use(cors()); // Permite que o front-end acesse a API
app.use(express.json()); // Permite que a API entenda requisições com corpo em JSON

// 4. Definir as Rotas
// Qualquer requisição para /api/auth será gerenciada pelo nosso arquivo de rotas
app.use('/api/auth', require('./routes/auth'));


// --- ROTA DE EXEMPLO PROTEGIDA ---
// Importamos nosso middleware de verificação
const authMiddleware = require('./middleware/auth');

// Esta rota só pode ser acessada se o usuário enviar um token válido
app.get('/api/dados-protegidos', authMiddleware, (req, res) => {
    // Graças ao middleware, `req.user` contém o payload do token (o ID do usuário)
    res.json({
        message: `Olá, usuário com ID ${req.user.id}! Estes são seus dados secretos.`,
        data: [
            { id: 1, item: 'Fraldas' },
            { id: 2, item: 'Leite em pó' }
        ]
    });
});


// 5. Iniciar o Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});