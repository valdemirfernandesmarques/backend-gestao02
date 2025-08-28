// backend/controllers/escolaController.js
const Escola = require('../models/Escola');

// Criar nova escola
exports.createEscola = async (req, res) => {
  try {
    const { nome, cnpj, email, endereco, logoUrl } = req.body;

    const escolaExistente = await Escola.findOne({ where: { email } });
    if (escolaExistente) {
      return res.status(400).json({ error: 'Já existe uma escola com este e-mail' });
    }

    const escola = await Escola.create({
      nome,
      cnpj,
      email,
      endereco,
      logoUrl,
      inicioPeriodoTeste: new Date()
    });

    res.status(201).json({ message: 'Escola criada com sucesso', escola });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar escola', details: error.message });
  }
};

// Listar todas as escolas
exports.getEscolas = async (req, res) => {
  try {
    const escolas = await Escola.findAll();
    res.json(escolas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar escolas', details: error.message });
  }
};

// Buscar escola por ID
exports.getEscolaById = async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id);
    if (!escola) return res.status(404).json({ error: 'Escola não encontrada' });
    res.json(escola);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar escola', details: error.message });
  }
};

// Atualizar escola
exports.updateEscola = async (req, res) => {
  try {
    const { nome, cnpj, email, endereco, logoUrl } = req.body;
    const escola = await Escola.findByPk(req.params.id);

    if (!escola) return res.status(404).json({ error: 'Escola não encontrada' });

    await escola.update({ nome, cnpj, email, endereco, logoUrl });
    res.json({ message: 'Escola atualizada com sucesso', escola });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar escola', details: error.message });
  }
};

// Deletar escola
exports.deleteEscola = async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id);
    if (!escola) return res.status(404).json({ error: 'Escola não encontrada' });

    await escola.destroy();
    res.json({ message: 'Escola deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar escola', details: error.message });
  }
};
