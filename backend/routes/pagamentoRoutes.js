const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');

// ROTAS DE PAGAMENTOS
router.post('/', pagamentoController.registrarPagamento);   // Criar pagamento
router.get('/', pagamentoController.listarPagamentos);      // Listar pagamentos

module.exports = router;
