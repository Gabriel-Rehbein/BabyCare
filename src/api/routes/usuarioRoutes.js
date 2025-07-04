const { isLoggedIn } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', isLoggedIn, usuarioController.listarUsuarios);
router.get('/:id', isLoggedIn, usuarioController.buscarUsuarioPorId);
router.put('/:id', isLoggedIn, usuarioController.atualizarUsuario);
router.get('/email/:email', isLoggedIn, usuarioController.buscarUsuarioPorEmail);
router.delete('/remove/:id', isLoggedIn, usuarioController.removerUsuario);

module.exports = router;