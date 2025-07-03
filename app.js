const express = require('express');
const app = express();

app.use(express.json());

const usuarioRoutes = require('./src/api/routes/usuarioRoutes');
app.use('/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Olá, você está no app de monitoria acadêmica!'
  })
});

module.exports = app;