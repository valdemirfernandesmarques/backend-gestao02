// backend/routes/mensalidadeRoutes.js
const express = require("express");
const router = express.Router();
const mensalidadeController = require("../controllers/mensalidadeController");
const authMiddleware = require("../middleware/authMiddleware");

// Criar mensalidade
router.post("/", authMiddleware, mensalidadeController.criarMensalidade);

// Listar mensalidades
router.get("/", authMiddleware, mensalidadeController.listarMensalidades);

// Atualizar mensalidade
router.put("/:id", authMiddleware, mensalidadeController.atualizarMensalidade);

// Deletar mensalidade
router.delete("/:id", authMiddleware, mensalidadeController.deletarMensalidade);

module.exports = router;
