const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  criarProduto,
  listarProdutos,
  atualizarProduto,
  deletarProduto,
  registrarVenda,
} = require("../controllers/estoqueController");

// Criar produto
router.post("/", authMiddleware, criarProduto);

// Listar produtos
router.get("/", authMiddleware, listarProdutos);

// Atualizar produto
router.put("/:id", authMiddleware, atualizarProduto);

// Deletar produto
router.delete("/:id", authMiddleware, deletarProduto);

// Registrar venda
router.post("/venda", authMiddleware, registrarVenda);

module.exports = router;
