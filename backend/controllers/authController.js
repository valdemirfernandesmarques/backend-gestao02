// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Escola = require('../models/Escola');

// Criação automática do SUPER_ADMIN
async function ensureSuperAdmin() {
  const email = "valdemir.marques1925@gmail.com";
  const senha = "Gestao@danca202558";

  let superAdmin = await User.findOne({ where: { email } });

  if (!superAdmin) {
    const senhaHash = await bcrypt.hash(senha, 10);

    // cria escola padrão se não existir
    let escola = await Escola.findOne();
    if (!escola) {
      escola = await Escola.create({
        nome: "Escola Exemplo de Dança",
        email: "contato@escolaexemplo.com"
      });
    }

    superAdmin = await User.create({
      nome: "Super Admin",
      email,
      senha: senhaHash,
      perfil: "SUPER_ADMIN",
      escolaId: escola.id
    });

    console.log("✅ SUPER_ADMIN criado com sucesso:", superAdmin.email);
  } else {
    console.log("🔑 SUPER_ADMIN já existe:", superAdmin.email);
  }
}

// Registro de usuário
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, perfil, escolaId } = req.body;

    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUser = await User.create({
      nome,
      email,
      senha: senhaHash,
      perfil,
      escolaId
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso', user: novoUser });
  } catch (error) {
    res.status(500).json({ error: 'Erro no registro', details: error.message });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: user.perfil },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login realizado com sucesso', token });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login', details: error.message });
  }
};

exports.ensureSuperAdmin = ensureSuperAdmin;
