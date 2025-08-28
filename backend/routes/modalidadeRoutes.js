// backend/routes/modalidadeRoutes.js
const express = require('express');
const router = express.Router();
const modalidadeController = require('../controllers/modalidadeController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas exigem login
router.post('/', authMiddleware, modalidadeController.createModalidade);
router.get('/', authMiddleware, modalidadeController.getModalidades);
router.get('/:id', authMiddleware, modalidadeController.getModalidadeById);
router.put('/:id', authMiddleware, modalidadeController.updateModalidade);
router.delete('/:id', authMiddleware, modalidadeController.deleteModalidade);

module.exports = router;
