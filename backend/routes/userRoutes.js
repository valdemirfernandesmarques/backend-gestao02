const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Criar usuário (somente autenticado)
router.post('/', auth, userController.criar);

// Listar usuários
router.get('/', auth, userController.listar);

module.exports = router;
