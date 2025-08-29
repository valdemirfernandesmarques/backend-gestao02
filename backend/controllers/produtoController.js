// backend/controllers/produtoController.js
const { Produto } = require('../models');

exports.criar = async (req, res) => {
  try {
    const { nome, sku, precoVenda, custo, quantidade, ativo, escolaId } = req.body;

    const escolaIdFinal = escolaId || req.user?.escolaId;
    if (!escolaIdFinal) {
      return res.status(400).json({ error: 'escolaId é obrigatório (no corpo ou pelo usuário autenticado)' });
    }

    const produto = await Produto.create({
      nome,
      sku,
      precoVenda,
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
    const escolaId = req.query.escolaId || req.user?.escolaId;
    const where = {};
    if (escolaId) where.escolaId = escolaId;

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
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter produto', details: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    await produto.update(req.body);
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

    await produto.destroy();
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto', details: error.message });
  }
};
