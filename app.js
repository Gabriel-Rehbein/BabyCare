const express = require('express');
const cors = require('cors');
const ApiError = require('./src/utils/ApiError'); 
const session = require('express-session');
const passport = require('passport');
const usuarioRoutes = require('./src/api/routes/usuarioRoutes');
const authRoutes = require('./src/api/routes/authRoutes');
const app = express();

require('dotenv').config();
require('./src/config/passport-setup');

app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'], // Adicione a URL do seu Live Server
  credentials: true
}));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Olá, você está no app de monitoria acadêmica!'
  })
});

app.use(session({
  secret: 'aleatorio',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/usuarios', usuarioRoutes);

app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error("ERRO GLOBAL:", err);
    
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
});

module.exports = app;