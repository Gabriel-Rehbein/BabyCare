const express = require('express');
const session = require('express-session');
const passport = require('passport');
const usuarioRoutes = require('./src/api/routes/usuarioRoutes');
const authRoutes = require('./src/api/routes/authRoutes');
const app = express();

require('dotenv').config();
require('./src/config/passport-setup');

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

module.exports = app;