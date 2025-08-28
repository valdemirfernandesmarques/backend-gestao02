// backend/controllers/userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Registro de usuário
exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const newUser = await User.create({
      nome,
      email,
      senha: hashedPassword,
    });

    res.status(201).json({
      message: "Usuário registrado com sucesso",
      user: { id: newUser.id, nome: newUser.nome, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar usuário", details: error.message });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login", details: error.message });
  }
};

// Perfil do usuário
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "nome", "email"],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perfil", details: error.message });
  }
};
