const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Registrar usuário
exports.registerUser = async (req, res) => {
  try {
    const { nome, email, senha, perfil, escolaId } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = await User.create({
      nome,
      email,
      senha: hashedPassword,
      perfil: perfil || "aluno",
      escolaId: escolaId || 1,
    });

    res.status(201).json({ message: "Usuário registrado com sucesso", user });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar usuário", details: err.message });
  }
};

// Login usuário
exports.loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: user.perfil },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login realizado com sucesso", token });
  } catch (err) {
    res.status(500).json({ error: "Erro ao realizar login", details: err.message });
  }
};

// Listar usuários
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar usuários", details: err.message });
  }
};
