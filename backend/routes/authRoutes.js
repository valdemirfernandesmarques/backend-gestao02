// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware"); // ✅ caminho correto

// Login
router.post("/login", authController.login);

// Rota protegida para pegar dados do usuário logado
router.get("/me", verifyToken, authController.getProfile);

module.exports = router;
