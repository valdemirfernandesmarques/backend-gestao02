// backend/routes/estoqueRoutes.js
const express = require("express");
const router = express.Router();
const estoqueController = require("../controllers/estoqueController");
const verifyToken = require("../middleware/authMiddleware"); // ✅ middleware correto

// Criar produto
router.post("/", verifyToken, estoqueController.criarProduto);

// Listar todos os produtos
router.get("/", verifyToken, estoqueController.listarProdutos);

// Obter produto por ID
router.get("/:id", verifyToken, estoqueController.getProduto);

// Atualizar produto
router.put("/:id", verifyToken, estoqueController.atualizarProduto);

// Excluir produto
router.delete("/:id", verifyToken, estoqueController.excluirProduto);

module.exports = router;
