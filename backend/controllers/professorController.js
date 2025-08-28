// backend/controllers/professorController.js
const Professor = require('../models/Professor');

exports.criarProfessor = async (req, res) => {
  try {
    const { nome, documento, telefone, email, escolaId, percentualComissao } = req.body;

    const professor = await Professor.create({
      nome,
      documento,
      telefone,
      email,
      escolaId,
      percentualComissao: percentualComissao ?? 0.5 // default 50%
    });

    res.status(201).json({
      message: 'Professor criado com sucesso!',
      professor
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar professor', details: error.message });
  }
};

exports.listarProfessores = async (req, res) => {
  try {
    const professores = await Professor.findAll();
    res.json(professores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar professores', details: error.message });
  }
};

exports.obterProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByPk(req.params.id);
    if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });
    res.json(professor);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter professor', details: error.message });
  }
};

exports.atualizarProfessor = async (req, res) => {
  try {
    const { nome, documento, telefone, email, ativo, percentualComissao } = req.body;

    const professor = await Professor.findByPk(req.params.id);
    if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });

    await professor.update({
      nome: nome ?? professor.nome,
      documento: documento ?? professor.documento,
      telefone: telefone ?? professor.telefone,
      email: email ?? professor.email,
      ativo: ativo ?? professor.ativo,
      percentualComissao: percentualComissao ?? professor.percentualComissao
    });

    res.json({ message: 'Professor atualizado com sucesso!', professor });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar professor', details: error.message });
  }
};

exports.deletarProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByPk(req.params.id);
    if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });

    await professor.destroy();
    res.json({ message: 'Professor deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar professor', details: error.message });
  }
};
