// backend/controllers/escolaController.js
const { Escola } = require("../models");

// Criar
exports.criarEscola = async (req, res) => {
  try {
    const { nome, isencaoAtiva } = req.body;
    const escola = await Escola.create({ nome, isencaoAtiva });
    res.status(201).json(escola);
  } catch (err) {
    console.error("Erro ao criar escola:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// Listar todas
exports.listarEscolas = async (req, res) => {
  try {
    const escolas = await Escola.findAll();
    res.json(escolas);
  } catch (err) {
    console.error("Erro ao listar escolas:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// Obter por ID
exports.obterEscola = async (req, res) => {
  try {
    const { id } = req.params;
    const escola = await Escola.findByPk(id);
    if (!escola) return res.status(404).json({ message: "Escola não encontrada" });
    res.json(escola);
  } catch (err) {
    console.error("Erro ao buscar escola:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// Atualizar
exports.atualizarEscola = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, isencaoAtiva } = req.body;

    const escola = await Escola.findByPk(id);
    if (!escola) return res.status(404).json({ message: "Escola não encontrada" });

    escola.nome = nome ?? escola.nome;
    escola.isencaoAtiva = isencaoAtiva ?? escola.isencaoAtiva;

    await escola.save();
    res.json(escola);
  } catch (err) {
    console.error("Erro ao atualizar escola:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// Deletar
exports.deletarEscola = async (req, res) => {
  try {
    const { id } = req.params;
    const escola = await Escola.findByPk(id);
    if (!escola) return res.status(404).json({ message: "Escola não encontrada" });

    await escola.destroy();
    res.json({ message: "Escola removida com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar escola:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};
