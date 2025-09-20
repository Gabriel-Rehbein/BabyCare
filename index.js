//carrega variaveis do .env
require('dotenv').config();

//Importação de pacotes
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Cria uma instancia do aplicativo Express
const app = express();

//Define a porta do servidor. Buscando pelo .env
const PORT = process.env.PORT || 3000;

//banco de dados
const users = []

//Middleware para permitir que a API entenda requisições em JSON
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Bem-Vindo à API do BabyCare! 👶')
});

//Rota de registro de usuario
app.post('/registrar', async (req, res) => {
    try {
        const { email, password } = req.body;

        //validação
        if (!email || !password) {
            return res.status(400).json({error: 'E-mail e senha são obritatórios.'});
        }

        //Verifica usuario existente
        const userExists = users.find(user => user.email === email);
        if (userExists) {
            return res.status(400).json({ error: 'Este e-mail já está em uso.'});
        }

        //Criptografia senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        users.push(newUser); //Salva em um array

        console.log('Novo usuário registrado:', newUser);

        res.status(201).json({ message: "Usuário registrado com sucesso!", userId: newUser.id});
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário.'});
    }
});


///////// ROTA DE LOGIN /////////
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // VALIDAÇÃO DE LOGIN (SIMPLES)
        if (!email || !password) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios.'});
        }

        //Procura user no BANCO
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.'});
        }

        //Compara senha com senha do BANCO
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status (401).json({ error: 'Credenciais inválidas.'});
        }

        //Se email e senha correto, cria token JWT
        const paylod = {userId: user.id, email: user.email};
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'}) //TEMPO DE EXPIRAÇÃO

        res.status(200).json({ message: 'Login bem-sucedido!', token: token});

    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.'});
    }
});

// =================================================================
// 🛡️ MIDDLEWARE DE VERIFICAÇÃO DE TOKEN
// =================================================================
const authMiddleware = (req, res, next) => {
    //Pega token do cabeçalho da requisição
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Formato "Bearer TOKEN"

    if(!token) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.'});
    }

    try {
        //Verifica token se é valido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //Adiciona os dados do usuário (payload) na requisição
        next(); // Passa para a próxima função (a rota protegida)
    } catch (error) {
        res.status(403).json({ error: 'Token inválido. '});
    }
};

app.listen(PORT, () => {
    console.log(`👶 Servidor da API BabyCare rodando em http://localhost:${PORT}`);
})


// app.post('/agendar-evento', (req, res) => {
//     const { title, date } = req.body;

//     if (!title || !date) {
//         return res.status
//     }
// })