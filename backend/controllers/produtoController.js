// backend/controllers/produtoController.js
const { Produto } = require('../models');

exports.criar = async (req, res) => {
  try {
    const { nome, sku, precoVenda, custo, quantidade, ativo, escolaId } = req.body;

    let escolaIdFinal;

    // SUPER_ADMIN pode criar produtos em qualquer escola (escolaId fornecido no body)
    if (req.user.perfil === 'SUPER_ADMIN') {
      if (!escolaId) {
        return res.status(400).json({ error: 'SUPER_ADMIN precisa informar escolaId para criar produto' });
      }
      escolaIdFinal = escolaId;
    }

    // ADMIN_ESCOLA só pode criar na própria escola
    if (req.user.perfil === 'ADMIN_ESCOLA') {
      escolaIdFinal = req.user.escolaId;
    }

    if (!escolaIdFinal) {
      return res.status(400).json({ error: 'escolaId é obrigatório' });
    }

    if (precoVenda === undefined || precoVenda === null) {
      return res.status(400).json({ error: 'precoVenda é obrigatório' });
    }

    const produto = await Produto.create({
      nome,
      sku,
      preco: precoVenda,
      custo,
      quantidade: quantidade ?? 0,
      ativo: ativo ?? true,
      escolaId: escolaIdFinal,
    });

    res.status(201).json({ message: 'Produto criado com sucesso', produto });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto', details: error.message });
  }
};

exports.listar = async (req, res) => {
  try {
    let where = {};

    if (req.user.perfil === 'ADMIN_ESCOLA') {
      where.escolaId = req.user.escolaId;
    } else if (req.user.perfil === 'SUPER_ADMIN' && req.query.escolaId) {
      where.escolaId = req.query.escolaId;
    }

    const produtos = await Produto.findAll({ where });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos', details: error.message });
  }
};

exports.obter = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && produto.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este produto' });
    }

    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter produto', details: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && produto.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este produto' });
    }

    const { nome, sku, precoVenda, custo, quantidade, ativo } = req.body;
    await produto.update({
      nome: nome ?? produto.nome,
      sku: sku ?? produto.sku,
      preco: precoVenda ?? produto.preco,
      custo: custo ?? produto.custo,
      quantidade: quantidade ?? produto.quantidade,
      ativo: ativo ?? produto.ativo,
    });

    res.json({ message: 'Produto atualizado com sucesso', produto });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
  }
};

exports.ajustarEstoque = async (req, res) => {
  try {
    const { quantidade } = req.body;
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && produto.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este produto' });
    }

    produto.quantidade = quantidade;
    await produto.save();

    res.json({ message: 'Estoque ajustado com sucesso', produto });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ajustar estoque', details: error.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && produto.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este produto' });
    }

    await produto.destroy();
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto', details: error.message });
  }
};
