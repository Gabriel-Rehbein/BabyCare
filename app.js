const express = require('express');
const app = express();

const usuarioRoutes = require('./src/api/routes/usuarioRoutes');

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Olá, você está no app de monitoria acadêmica!'
  })
});

//Aqui virão as rotas ( ex.: app.use('/api/usuarios', usuarioRoutes); )

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/usuario', usuarioRoutes);

module.exports = app;