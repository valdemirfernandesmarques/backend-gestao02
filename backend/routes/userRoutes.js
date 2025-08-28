// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Registro de usuário
router.post("/register", userController.register);

// Login de usuário
router.post("/login", userController.login);

// Perfil do usuário (precisa de token)
router.get("/profile", authMiddleware, userController.getProfile);

module.exports = router;
