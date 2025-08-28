// backend/routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas exigem login
router.post('/', authMiddleware, alunoController.createAluno);
router.get('/', authMiddleware, alunoController.getAlunos);
router.get('/:id', authMiddleware, alunoController.getAlunoById);
router.put('/:id', authMiddleware, alunoController.updateAluno);
router.delete('/:id', authMiddleware, alunoController.deleteAluno);

module.exports = router;
