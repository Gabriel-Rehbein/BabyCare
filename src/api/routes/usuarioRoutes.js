const { isLoggedIn } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', isLoggedIn, usuarioController.getAllUsers);
router.get('/:id', usuarioController.buscarPorId);

module.exports = router;