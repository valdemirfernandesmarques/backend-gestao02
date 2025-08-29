const { Escola } = require("../models");

// Criar escola
exports.criarEscola = async (req, res) => {
  try {
    const { nome, endereco } = req.body;
    const escola = await Escola.create({ nome, endereco });
    res.status(201).json(escola);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar escola", details: err.message });
  }
};

// Listar escolas
exports.listarEscolas = async (req, res) => {
  try {
    const escolas = await Escola.findAll();
    res.json(escolas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar escolas", details: err.message });
  }
};
