// backend/controllers/modalidadeController.js
const Modalidade = require('../models/Modalidade');

exports.createModalidade = async (req, res) => {
  try {
    const modalidade = await Modalidade.create(req.body);
    res.status(201).json({ message: 'Modalidade criada com sucesso', modalidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar modalidade', details: error.message });
  }
};

exports.getModalidades = async (req, res) => {
  try {
    const modalidades = await Modalidade.findAll();
    res.json(modalidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar modalidades', details: error.message });
  }
};

exports.getModalidadeById = async (req, res) => {
  try {
    const modalidade = await Modalidade.findByPk(req.params.id);
    if (!modalidade) return res.status(404).json({ error: 'Modalidade não encontrada' });
    res.json(modalidade);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar modalidade', details: error.message });
  }
};

exports.updateModalidade = async (req, res) => {
  try {
    const modalidade = await Modalidade.findByPk(req.params.id);
    if (!modalidade) return res.status(404).json({ error: 'Modalidade não encontrada' });

    await modalidade.update(req.body);
    res.json({ message: 'Modalidade atualizada com sucesso', modalidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar modalidade', details: error.message });
  }
};

exports.deleteModalidade = async (req, res) => {
  try {
    const modalidade = await Modalidade.findByPk(req.params.id);
    if (!modalidade) return res.status(404).json({ error: 'Modalidade não encontrada' });

    await modalidade.destroy();
    res.json({ message: 'Modalidade deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar modalidade', details: error.message });
  }
};
