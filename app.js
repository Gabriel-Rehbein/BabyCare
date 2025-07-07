// app.js
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import 'dotenv/config'; // Carrega as variáveis de ambiente

// Importa os módulos da aplicação com a extensão .js
import ApiError from './src/utils/ApiError.js';
import './src/config/passport-setup.js'; // Apenas executa o arquivo de configuração

// Rotas
import usuarioRoutes from './src/api/routes/usuarioRoutes.js';
import authRoutes from './src/api/routes/authRoutes.js';

const app = express();

// Configuração de CORS
app.use(cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:5500', 'http://127.0.0.1:5500'], 
    credentials: true,
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração da Sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'uma_chave_secreta_muito_forte',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// Rotas da Aplicação
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API de Monitoria Acadêmica no ar!' });
});

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);

// Middleware de Tratamento de Erros
app.use((err, req, res, next) => {
    console.error("ERRO GLOBAL:", err);
    
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
});

// Exporta a instância do app
export default app;
