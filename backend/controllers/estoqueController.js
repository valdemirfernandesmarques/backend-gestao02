const { Produto, Venda } = require("../models");

// Criar produto
exports.criarProduto = async (req, res) => {
  try {
    const { nome, preco, quantidade } = req.body;
    const produto = await Produto.create({ nome, preco, quantidade });
    res.status(201).json(produto);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar produto", details: err.message });
  }
};

// Listar produtos
exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar produtos", details: err.message });
  }
};

// Atualizar produto
exports.atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, quantidade } = req.body;

    const produto = await Produto.findByPk(id);
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });

    produto.nome = nome || produto.nome;
    produto.preco = preco || produto.preco;
    produto.quantidade = quantidade || produto.quantidade;
    await produto.save();

    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar produto", details: err.message });
  }
};

// Deletar produto
exports.deletarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });

    await produto.destroy();
    res.json({ message: "Produto deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar produto", details: err.message });
  }
};

// Registrar venda
exports.registrarVenda = async (req, res) => {
  try {
    const { produtoId, quantidadeVendida } = req.body;
    const produto = await Produto.findByPk(produtoId);

    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
    if (produto.quantidade < quantidadeVendida)
      return res.status(400).json({ error: "Estoque insuficiente" });

    produto.quantidade -= quantidadeVendida;
    await produto.save();

    const venda = await Venda.create({
      produtoId,
      quantidade: quantidadeVendida,
      valorTotal: quantidadeVendida * produto.preco,
    });

    res.status(201).json({ message: "Venda registrada com sucesso", venda });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar venda", details: err.message });
  }
};
