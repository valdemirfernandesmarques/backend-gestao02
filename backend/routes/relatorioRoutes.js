// backend/routes/relatorioRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/relatorioController');
const authMiddleware = require('../middleware/authMiddleware');

// Relatório financeiro geral
router.get('/financeiro', authMiddleware, controller.financeiroGeral);

// Relatório financeiro por professor
router.get('/financeiro/professores', authMiddleware, controller.financeiroPorProfessor);

module.exports = router;
