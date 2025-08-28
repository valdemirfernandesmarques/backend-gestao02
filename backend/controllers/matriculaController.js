// backend/controllers/matriculaController.js
const { Matricula, Aluno, Turma } = require('../models');

// Criar matrícula
const criarMatricula = async (req, res) => {
  try {
    const { alunoId, turmaId } = req.body;

    const matricula = await Matricula.create({
      alunoId,
      turmaId,
      dataMatricula: new Date(),
      ativo: true
    });

    res.status(201).json({ message: 'Matrícula criada com sucesso!', matricula });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar matrícula', details: error.message });
  }
};

// Listar todas as matrículas
const listarMatriculas = async (req, res) => {
  try {
    const matriculas = await Matricula.findAll({
      include: [
        { model: Aluno, as: 'aluno' },
        { model: Turma, as: 'turma' }
      ]
    });

    res.json(matriculas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar matrículas', details: error.message });
  }
};

// Obter matrícula por ID
const obterMatricula = async (req, res) => {
  try {
    const matricula = await Matricula.findByPk(req.params.id, {
      include: [
        { model: Aluno, as: 'aluno' },
        { model: Turma, as: 'turma' }
      ]
    });

    if (!matricula) {
      return res.status(404).json({ error: 'Matrícula não encontrada' });
    }

    res.json(matricula);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar matrícula', details: error.message });
  }
};

// Atualizar matrícula
const atualizarMatricula = async (req, res) => {
  try {
    const matricula = await Matricula.findByPk(req.params.id);

    if (!matricula) return res.status(404).json({ error: 'Matrícula não encontrada' });

    await matricula.update(req.body);

    res.json({ message: 'Matrícula atualizada com sucesso!', matricula });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar matrícula', details: error.message });
  }
};

// Deletar matrícula
const deletarMatricula = async (req, res) => {
  try {
    const matricula = await Matricula.findByPk(req.params.id);

    if (!matricula) return res.status(404).json({ error: 'Matrícula não encontrada' });

    await matricula.destroy();

    res.json({ message: 'Matrícula deletada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar matrícula', details: error.message });
  }
};

// 🔑 Exporta todas as funções corretamente
module.exports = {
  criarMatricula,
  listarMatriculas,
  obterMatricula,
  atualizarMatricula,
  deletarMatricula
};
