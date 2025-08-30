// backend/controllers/authController.js
const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = db.User;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: user.perfil },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      message: "Login realizado com sucesso",
      token,
      user: { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil },
    });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    return res.status(500).json({ error: "Erro interno no login" });
  }
};

// 🔹 Função que estava faltando
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "nome", "email", "perfil"],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Erro ao buscar perfil:", error);
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
};
