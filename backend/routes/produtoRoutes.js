const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const auth = require('../middleware/authMiddleware');

// Criar produto
router.post('/', auth, produtoController.criar);

// Listar produtos
router.get('/', auth, produtoController.listar);

// Obter produto por ID
router.get('/:id', auth, produtoController.obter);

// Atualizar produto
router.put('/:id', auth, produtoController.atualizar);

// Ajustar estoque
router.patch('/:id/estoque', auth, produtoController.ajustarEstoque);

// Remover produto
router.delete('/:id', auth, produtoController.remover);

module.exports = router;
