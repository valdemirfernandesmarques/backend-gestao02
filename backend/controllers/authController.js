// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");

// ================================
// Função de Login
// ================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    // Gera token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    return res.status(500).json({ error: "Erro interno no login" });
  }
};

// ================================
// Função de Registro
// ================================
exports.register = async (req, res) => {
  try {
    const { nome, email, password, role } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
    }

    const userExists = await db.User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
      nome,
      email,
      password: hashedPassword,
      role: role || "user", // default = user
    });

    return res.status(201).json({
      message: "Usuário registrado com sucesso",
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Erro no registro:", error);
    return res.status(500).json({ error: "Erro interno no registro" });
  }
};
