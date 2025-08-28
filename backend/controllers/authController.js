// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Escola = require('../models/Escola');

// Função para criar SUPER_ADMIN automático se não existir
async function ensureSuperAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASS;

    // Procura se já existe SUPER_ADMIN
    let admin = await User.findOne({ where: { email: adminEmail } });

    if (!admin) {
      // Cria escola exemplo para o SUPER_ADMIN
      const [escolaExemplo] = await Escola.findOrCreate({
        where: { nome: 'Escola Exemplo de Dança' },
        defaults: {
          email: 'contato@escolaexemplo.com',
        },
      });

      // Cria o usuário SUPER_ADMIN
      const hashedPassword = await bcrypt.hash(adminPass, 10);
      admin = await User.create({
        nome: 'Super Admin',
        email: adminEmail,
        senha: hashedPassword,
        perfil: 'SUPER_ADMIN',
        escolaId: escolaExemplo.id,
      });

      console.log('✅ SUPER_ADMIN criado com sucesso:', adminEmail);
    } else {
      console.log('ℹ️ SUPER_ADMIN já existe:', adminEmail);
    }
  } catch (error) {
    console.error('❌ Erro ao garantir SUPER_ADMIN:', error);
  }
}

module.exports = {
  // Chama essa função em server.js logo após conectar no banco
  ensureSuperAdmin,

  // Registro manual de usuário comum (opcional)
  async register(req, res) {
    try {
      const { nome, email, senha, perfil, escolaId } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);
      const user = await User.create({
        nome,
        email,
        senha: hashedPassword,
        perfil: perfil || 'ADMIN_ESCOLA',
        escolaId,
      });

      return res.status(201).json({ message: 'Usuário registrado com sucesso', user });
    } catch (error) {
      console.error('Erro no register:', error);
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      const token = jwt.sign(
        { id: user.id, perfil: user.perfil, escolaId: user.escolaId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({ message: 'Login bem-sucedido', token, user });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro no login' });
    }
  },
};
