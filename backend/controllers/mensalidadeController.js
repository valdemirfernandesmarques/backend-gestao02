// backend/controllers/mensalidadeController.js
const { Mensalidade, Matricula, Aluno, Escola } = require('../models');

// Criar mensalidade
exports.criarMensalidade = async (req, res) => {
  try {
    const { matriculaId, valor, dataVencimento } = req.body;

    if (!matriculaId || !valor || !dataVencimento) {
      return res.status(400).json({ error: 'Campos obrigatórios: matriculaId, valor e dataVencimento' });
    }

    if (isNaN(valor) || valor <= 0) {
      return res.status(400).json({ error: 'O valor deve ser um número maior que 0' });
    }

    // Inclui Escola através da associação Matricula -> Escola
    const matricula = await Matricula.findByPk(matriculaId, {
      include: [{ model: Escola, as: 'escola', attributes: ['id', 'nome'] }]
    });

    if (!matricula) return res.status(404).json({ error: 'Matrícula não encontrada' });

    // ADMIN_ESCOLA só pode criar mensalidade da própria escola
    if (req.user.perfil === 'ADMIN_ESCOLA' && matricula.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado: matrícula pertence a outra escola' });
    }

    const mensalidade = await Mensalidade.create({
      matriculaId,
      valor,
      dataVencimento,
      escolaId: matricula.escolaId // garante associação correta
    });

    res.status(201).json({ message: 'Mensalidade criada com sucesso!', mensalidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar mensalidade', details: error.message });
  }
};

// Listar mensalidades
exports.listarMensalidades = async (req, res) => {
  try {
    const where = {};

    if (req.user.perfil === 'ADMIN_ESCOLA') {
      where.escolaId = req.user.escolaId;
    }

    const mensalidades = await Mensalidade.findAll({
      where,
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            { model: Aluno, attributes: ['id', 'nome'] },
            { model: Escola, as: 'escola', attributes: ['id', 'nome'] }
          ]
        }
      ]
    });

    res.json(mensalidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar mensalidades', details: error.message });
  }
};

// Obter mensalidade por ID
exports.obterMensalidade = async (req, res) => {
  try {
    const mensalidade = await Mensalidade.findByPk(req.params.id, {
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            { model: Aluno, attributes: ['id', 'nome'] },
            { model: Escola, as: 'escola', attributes: ['id', 'nome'] }
          ]
        }
      ]
    });

    if (!mensalidade) return res.status(404).json({ error: 'Mensalidade não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a esta mensalidade' });
    }

    res.json(mensalidade);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter mensalidade', details: error.message });
  }
};

// Atualizar mensalidade
exports.atualizarMensalidade = async (req, res) => {
  try {
    const mensalidade = await Mensalidade.findByPk(req.params.id, {
      include: [
        { model: Matricula, as: 'matricula', include: [{ model: Escola, as: 'escola' }] }
      ]
    });

    if (!mensalidade) return res.status(404).json({ error: 'Mensalidade não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a esta mensalidade' });
    }

    await mensalidade.update(req.body);
    res.json({ message: 'Mensalidade atualizada com sucesso!', mensalidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar mensalidade', details: error.message });
  }
};

// Deletar mensalidade
exports.deletarMensalidade = async (req, res) => {
  try {
    const mensalidade = await Mensalidade.findByPk(req.params.id, {
      include: [
        { model: Matricula, as: 'matricula', include: [{ model: Escola, as: 'escola' }] }
      ]
    });

    if (!mensalidade) return res.status(404).json({ error: 'Mensalidade não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a esta mensalidade' });
    }

    await mensalidade.destroy();
    res.json({ message: 'Mensalidade deletada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar mensalidade', details: error.message });
  }
};
