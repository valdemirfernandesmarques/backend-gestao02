// backend/routes/escolaRoutes.js
const express = require('express');
const router = express.Router();
const escolaController = require('../controllers/escolaController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas abaixo precisam de login (token válido)
router.post('/', authMiddleware, escolaController.createEscola);
router.get('/', authMiddleware, escolaController.getEscolas);
router.get('/:id', authMiddleware, escolaController.getEscolaById);
router.put('/:id', authMiddleware, escolaController.updateEscola);
router.delete('/:id', authMiddleware, escolaController.deleteEscola);

module.exports = router;
