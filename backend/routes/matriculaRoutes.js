const express = require("express");
const router = express.Router();
const matriculaController = require("../controllers/matriculaController");
const authMiddleware = require("../middleware/authMiddleware"); // <<< AJUSTADO

// Rotas de matrículas
router.post("/", authMiddleware, matriculaController.criarMatricula);
router.get("/", authMiddleware, matriculaController.listarMatriculas);
router.get("/:id", authMiddleware, matriculaController.obterMatricula);
router.put("/:id", authMiddleware, matriculaController.atualizarMatricula);
router.delete("/:id", authMiddleware, matriculaController.deletarMatricula);

module.exports = router;
