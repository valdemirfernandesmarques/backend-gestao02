const express = require("express");
const router = express.Router();
const { criarEscola, listarEscolas } = require("../controllers/escolaController");

// Criar escola
router.post("/", criarEscola);

// Listar escolas
router.get("/", listarEscolas);

module.exports = router;
