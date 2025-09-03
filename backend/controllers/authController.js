const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'nome', 'email', 'perfil', 'escolaId', 'password']
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    if (!user.password) {
      return res.status(500).json({ error: 'Erro interno: senha do usuário não encontrada' });
    }

    const senhaValida = await bcrypt.compare(senha, user.password);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: user.perfil, escolaId: user.escolaId || null },
      process.env.JWT_SECRET || 'segredo123',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        escolaId: user.escolaId || null,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
