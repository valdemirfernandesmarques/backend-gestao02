// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    // ✅ Gera o token com os dados certos
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        perfil: user.perfil,   // <- aqui estava vazio
        escolaId: user.escolaId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,     // <- garante retorno correto
        escolaId: user.escolaId, // <- garante retorno correto
      },
    });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ["id", "nome", "email", "perfil", "escolaId"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Erro ao buscar perfil:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
