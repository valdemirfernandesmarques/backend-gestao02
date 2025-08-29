const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  gerarRelatorioFinanceiro,
  gerarNotaFiscalSimulada,
} = require("../controllers/relatorioController");

// Relatório Financeiro
router.get("/financeiro", authMiddleware, gerarRelatorioFinanceiro);

// Nota Fiscal (simulação)
router.post("/nf", authMiddleware, gerarNotaFiscalSimulada);

module.exports = router;
