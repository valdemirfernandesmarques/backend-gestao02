// backend/controllers/turmaController.js
const Turma = require('../models/Turma');
const Professor = require('../models/Professor');
const Modalidade = require('../models/Modalidade');

exports.createTurma = async (req, res) => {
  try {
    const turma = await Turma.create(req.body);
    res.status(201).json({ message: 'Turma criada com sucesso', turma });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar turma', details: error.message });
  }
};

exports.getTurmas = async (req, res) => {
  try {
    const turmas = await Turma.findAll({
      include: [
        { model: Professor, as: 'professor' },
        { model: Modalidade, as: 'modalidade' }
      ]
    });
    res.json(turmas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar turmas', details: error.message });
  }
};

exports.getTurmaById = async (req, res) => {
  try {
    const turma = await Turma.findByPk(req.params.id, {
      include: [
        { model: Professor, as: 'professor' },
        { model: Modalidade, as: 'modalidade' }
      ]
    });
    if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });
    res.json(turma);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar turma', details: error.message });
  }
};

exports.updateTurma = async (req, res) => {
  try {
    const turma = await Turma.findByPk(req.params.id);
    if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });

    await turma.update(req.body);
    res.json({ message: 'Turma atualizada com sucesso', turma });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar turma', details: error.message });
  }
};

exports.deleteTurma = async (req, res) => {
  try {
    const turma = await Turma.findByPk(req.params.id);
    if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });

    await turma.destroy();
    res.json({ message: 'Turma deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar turma', details: error.message });
  }
};
