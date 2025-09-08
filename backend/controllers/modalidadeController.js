const { Modalidade } = require('../models');

// Criar uma nova modalidade
exports.createModalidade = async (req, res) => {
  try {
    const { nome, precoAula, descricao } = req.body;

    if (!nome || !precoAula) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: nome e precoAula' 
      });
    }

    // SUPER_ADMIN pode criar em qualquer escola
    const escolaId = req.user.perfil === 'SUPER_ADMIN' ? req.body.escolaId || null : req.user.escolaId;

    // ADMIN_ESCOLA só pode criar em sua própria escola
    if (req.user.perfil === 'ADMIN_ESCOLA' && !escolaId) {
      return res.status(403).json({ error: 'Usuário não pertence a nenhuma escola' });
    }

    const modalidade = await Modalidade.create({ nome, precoAula, descricao, escolaId });
    res.status(201).json({ message: 'Modalidade criada com sucesso', modalidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar modalidade', details: error.message });
  }
};

// Listar todas as modalidades
exports.getModalidades = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.perfil === 'ADMIN_ESCOLA') {
      whereClause = { escolaId: req.user.escolaId };
    }
    // SUPER_ADMIN vê todas as modalidades
    const modalidades = await Modalidade.findAll({ where: whereClause });
    res.json(modalidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar modalidades', details: error.message });
  }
};

// Buscar modalidade por ID
exports.getModalidadeById = async (req, res) => {
  try {
    const modalidade = await Modalidade.findByPk(req.params.id);
    if (!modalidade) return res.status(404).json({ error: 'Modalidade não encontrada' });

    // ADMIN_ESCOLA só vê sua própria escola
    if (req.user.perfil === 'ADMIN_ESCOLA' && modalidade.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a esta modalidade' });
    }

    res.json(modalidade);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar modalidade', details: error.message });
  }
};

// Atualizar modalidade
exports.updateModalidade = async (req, res) => {
  try {
    const modalidade = await Modalidade.findByPk(req.params.id);
    if (!modalidade) return res.status(404).json({ error: 'Modalidade não encontrada' });

    // ADMIN_ESCOLA só atualiza sua própria escola
    if (req.user.perfil === 'ADMIN_ESCOLA' && modalidade.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a esta modalidade' });
    }

    const { nome, precoAula, descricao } = req.body;
    await modalidade.update({ nome, precoAula, descricao });
    res.json({ message: 'Modalidade atualizada com sucesso', modalidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar modalidade', details: error.message });
  }
};

// Deletar modalidade
exports.deleteModalidade = async (req, res) => {
  try {
    const modalidade = await Modalidade.findByPk(req.params.id);
    if (!modalidade) return res.status(404).json({ error: 'Modalidade não encontrada' });

    // ADMIN_ESCOLA só deleta sua própria escola
    if (req.user.perfil === 'ADMIN_ESCOLA' && modalidade.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a esta modalidade' });
    }

    await modalidade.destroy();
    res.json({ message: 'Modalidade deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar modalidade', details: error.message });
  }
};
