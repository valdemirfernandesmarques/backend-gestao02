// backend/routes/escolaRoutes.js
const express = require("express");
const router = express.Router();
const {
  criarEscola,
  listarEscolas,
  obterEscola,
  atualizarEscola,
  deletarEscola,
} = require("../controllers/escolaController");

// Criar escola
router.post("/", criarEscola);

// Listar todas as escolas
router.get("/", listarEscolas);

// Obter uma escola pelo ID
router.get("/:id", obterEscola);

// Atualizar uma escola pelo ID
router.put("/:id", atualizarEscola);

// Deletar uma escola pelo ID
router.delete("/:id", deletarEscola);

module.exports = router;
