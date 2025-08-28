// backend/routes/mensalidadeRoutes.js
const express = require('express');
const router = express.Router();
const mensalidadeController = require('../controllers/mensalidadeController');

// Criar uma mensalidade
router.post('/', mensalidadeController.criarMensalidade);

// Listar todas as mensalidades
router.get('/', mensalidadeController.listarMensalidades);

// Atualizar uma mensalidade
router.put('/:id', mensalidadeController.atualizarMensalidade);

// Deletar uma mensalidade
router.delete('/:id', mensalidadeController.deletarMensalidade);

module.exports = router;
