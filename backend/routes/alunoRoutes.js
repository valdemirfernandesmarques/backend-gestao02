// backend/routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Certifique-se de importar corretamente
const alunoController = require('../controllers/alunoController');

// Todas as rotas exigem autenticação
router.post('/', authMiddleware, alunoController.createAluno);       // Criar aluno
router.get('/', authMiddleware, alunoController.getAlunos);          // Listar todos os alunos
router.get('/:id', authMiddleware, alunoController.getAlunoById);    // Buscar aluno por ID
router.put('/:id', authMiddleware, alunoController.updateAluno);     // Atualizar aluno
router.delete('/:id', authMiddleware, alunoController.deleteAluno);  // Deletar aluno

module.exports = router;
