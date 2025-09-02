const { User } = require("../models");
const bcrypt = require("bcryptjs");

// Criar usuário
exports.criarUsuario = async (req, res) => {
  try {
    const { nome, email, password, perfil, escolaId } = req.body;

    // Verifica se o e-mail já existe
    const userExistente = await User.findOne({ where: { email } });
    if (userExistente) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const novoUsuario = await User.create({
      nome,
      email,
      password: hashedPassword,
      perfil,
      escolaId,
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error });
  }
};

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar usuários", error });
  }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, password, perfil, escolaId } = req.body;

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }

    usuario.nome = nome || usuario.nome;
    usuario.email = email || usuario.email;
    usuario.perfil = perfil || usuario.perfil;
    usuario.escolaId = escolaId !== undefined ? escolaId : usuario.escolaId;

    await usuario.save();

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário", error });
  }
};

// Deletar usuário
exports.deletarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await usuario.destroy();
    res.json({ message: "Usuário removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário", error });
  }
};
