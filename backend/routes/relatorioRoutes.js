const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware"); // caminho correto (pasta 'middleware')
const {
  relatorioFinanceiroEscola,
  relatorioFinanceiroSuperadmin,
} = require("../controllers/relatorioController"); // importa pelos MESMOS nomes exportados

// GET /api/relatorios/financeiro/escola?escolaId=1&inicio=2025-08-01&fim=2025-08-31
router.get("/financeiro/escola", verifyToken, relatorioFinanceiroEscola);

// GET /api/relatorios/financeiro/superadmin?inicio=2025-08-01&fim=2025-08-31
router.get("/financeiro/superadmin", verifyToken, relatorioFinanceiroSuperadmin);

module.exports = router;
