const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');

router.post('/', usuarioController.createUser);
router.get('/', usuarioController.getAllUsers);
router.get('/:id', usuarioController.getUserById);
router.put('/:id', usuarioController.updateUser);
router.delete('/:id', usuarioController.deleteUser);

module.exports = router;