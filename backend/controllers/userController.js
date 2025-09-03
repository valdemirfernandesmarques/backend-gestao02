const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.criar = async (req, res) => {
  try {
    const { nome, email, senha, perfil, escolaId } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    const user = await User.create({ nome, email, password: hash, perfil, escolaId });

    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário', details: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'nome', 'email', 'perfil', 'escolaId'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar usuários', details: err.message });
  }
};
