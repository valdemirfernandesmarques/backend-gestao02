const { Escola } = require('../models');

exports.criar = async (req, res) => {
  try {
    const { nome, isencaoAtiva } = req.body;
    const escola = await Escola.create({ nome, isencaoAtiva: isencaoAtiva ?? false });
    res.status(201).json(escola);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar escola', details: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const escolas = await Escola.findAll();
    res.json(escolas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar escolas', details: err.message });
  }
};

exports.obter = async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id);
    if (!escola) return res.status(404).json({ error: 'Escola não encontrada' });
    res.json(escola);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter escola', details: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id);
    if (!escola) return res.status(404).json({ error: 'Escola não encontrada' });

    await escola.update(req.body);
    res.json({ message: 'Escola atualizada com sucesso', escola });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar escola', details: err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id);
    if (!escola) return res.status(404).json({ error: 'Escola não encontrada' });

    await escola.destroy();
    res.json({ message: 'Escola removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover escola', details: err.message });
  }
};
