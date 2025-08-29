const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers } = require("../controllers/userController");

// Cadastro
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Listar usuários
router.get("/", getUsers);

module.exports = router;
