// backend/routes/relatorioRoutes.js
const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");
const authMiddleware = require("../middleware/authMiddleware");

// Relatório financeiro
router.get("/financeiro", authMiddleware, relatorioController.relatorioFinanceiro);

// Emissão simulada de Nota Fiscal
router.post("/nfe", authMiddleware, relatorioController.gerarNotaFiscal);

module.exports = router;
