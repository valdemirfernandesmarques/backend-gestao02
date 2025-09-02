const express = require("express");
const router = express.Router();
const {
  criarUsuario,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario,
} = require("../controllers/userController");

// Criar usuário
router.post("/", criarUsuario);

// Listar usuários
router.get("/", listarUsuarios);

// Atualizar usuário
router.put("/:id", atualizarUsuario);

// Deletar usuário
router.delete("/:id", deletarUsuario);

module.exports = router;
