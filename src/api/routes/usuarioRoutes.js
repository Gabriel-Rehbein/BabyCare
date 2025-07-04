const { isLoggedIn } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', isLoggedIn, usuarioController.listarUsuarios);
router.get('/:id', usuarioController.buscarUsuarioPorId);
router.get('/email/:email', isLoggedIn, usuarioController.buscarUsuarioPorEmail);

module.exports = router;