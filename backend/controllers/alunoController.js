// backend/controllers/alunoController.js
const Aluno = require('../models/Aluno');

exports.createAluno = async (req, res) => {
  try {
    const { nome, cpf, dataNascimento, genero, cep, endereco, numero, bairro, cidade, estado, telefone, email, responsavelFinanceiro, escolaId } = req.body;

    const aluno = await Aluno.create({
      nome,
      cpf,
      dataNascimento,
      genero,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      telefone,
      email,
      responsavelFinanceiro,
      escolaId
    });

    res.status(201).json({ message: 'Aluno criado com sucesso', aluno });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar aluno', details: error.message });
  }
};

exports.getAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos', details: error.message });
  }
};

exports.getAlunoById = async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aluno', details: error.message });
  }
};

exports.updateAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });

    await aluno.update(req.body);
    res.json({ message: 'Aluno atualizado com sucesso', aluno });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar aluno', details: error.message });
  }
};

exports.deleteAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });

    await aluno.destroy();
    res.json({ message: 'Aluno deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aluno', details: error.message });
  }
};
