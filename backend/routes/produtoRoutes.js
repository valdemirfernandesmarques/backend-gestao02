// backend/routes/produtoRoutes.js
const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, produtoController.criar);
router.get('/', auth, produtoController.listar);
router.get('/:id', auth, produtoController.obter);
router.put('/:id', auth, produtoController.atualizar);
router.patch('/:id/estoque', auth, produtoController.ajustarEstoque);
router.delete('/:id', auth, produtoController.remover);

module.exports = router;
