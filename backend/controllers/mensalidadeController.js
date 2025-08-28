// backend/controllers/mensalidadeController.js
const { Mensalidade, Matricula } = require('../models');

exports.criarMensalidade = async (req, res) => {
  try {
    const { matriculaId, valor, dataVencimento } = req.body;

    const matricula = await Matricula.findByPk(matriculaId);
    if (!matricula) return res.status(404).json({ error: 'Matrícula não encontrada' });

    const mensalidade = await Mensalidade.create({ matriculaId, valor, dataVencimento });

    res.status(201).json({ message: 'Mensalidade criada com sucesso!', mensalidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar mensalidade', details: error.message });
  }
};

exports.listarMensalidades = async (req, res) => {
  try {
    const mensalidades = await Mensalidade.findAll({ include: 'matricula' });
    res.json(mensalidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar mensalidades', details: error.message });
  }
};

exports.atualizarMensalidade = async (req, res) => {
  try {
    const mensalidade = await Mensalidade.findByPk(req.params.id);

    if (!mensalidade) return res.status(404).json({ error: 'Mensalidade não encontrada' });

    await mensalidade.update(req.body);

    res.json({ message: 'Mensalidade atualizada com sucesso!', mensalidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar mensalidade', details: error.message });
  }
};

exports.deletarMensalidade = async (req, res) => {
  try {
    const mensalidade = await Mensalidade.findByPk(req.params.id);

    if (!mensalidade) return res.status(404).json({ error: 'Mensalidade não encontrada' });

    await mensalidade.destroy();

    res.json({ message: 'Mensalidade deletada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar mensalidade', details: error.message });
  }
};
