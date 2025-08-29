// backend/controllers/vendaController.js
const sequelize = require('../config/database');
const { Venda, VendaItem, Produto, Pagamento } = require('../models');

exports.criarVenda = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { itens, descontos = 0, metodoPagamento = 'PIX', escolaId } = req.body;
    // itens: [{ produtoId, quantidade, precoUnitario? }]

    if (!Array.isArray(itens) || itens.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Informe itens da venda' });
    }

    const escolaIdFinal = escolaId || req.user?.escolaId;
    if (!escolaIdFinal) {
      await t.rollback();
      return res.status(400).json({ error: 'escolaId é obrigatório (no corpo ou pelo usuário autenticado)' });
    }

    // Carregar produtos e checar estoque
    const produtosIds = itens.map(i => i.produtoId);
    const produtos = await Produto.findAll({ where: { id: produtosIds } });

    if (produtos.length !== itens.length) {
      await t.rollback();
      return res.status(400).json({ error: 'Um ou mais produtos não foram encontrados' });
    }

    // Calcular totais e validar estoque
    let totalBruto = 0;
    for (const item of itens) {
      const produto = produtos.find(p => p.id === item.produtoId);
      const precoUnitario = item.precoUnitario ?? Number(produto.precoVenda);
      if (item.quantidade <= 0) {
        await t.rollback();
        return res.status(400).json({ error: `Quantidade inválida para o produto ${produto.nome}` });
      }
      if (produto.quantidade < item.quantidade) {
        await t.rollback();
        return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}` });
      }
      totalBruto += precoUnitario * item.quantidade;
    }

    const totalDescontos = Number(descontos) || 0;
    const totalLiquido = Number((totalBruto - totalDescontos).toFixed(2));
    if (totalLiquido < 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Total líquido não pode ser negativo' });
    }

    // Criar venda
    const venda = await Venda.create({
      escolaId: escolaIdFinal,
      usuarioId: req.user?.id || null,
      totalBruto,
      totalDescontos,
      totalLiquido,
      metodoPagamento,
      dataVenda: new Date(),
    }, { transaction: t });

    // Criar itens e baixar estoque
    for (const item of itens) {
      const produto = produtos.find(p => p.id === item.produtoId);
      const precoUnitario = item.precoUnitario ?? Number(produto.precoVenda);
      const subtotal = Number((precoUnitario * item.quantidade).toFixed(2));

      await VendaItem.create({
        vendaId: venda.id,
        produtoId: produto.id,
        quantidade: item.quantidade,
        precoUnitario,
        subtotal,
      }, { transaction: t });

      // Baixar estoque
      produto.quantidade = produto.quantidade - item.quantidade;
      await produto.save({ transaction: t });
    }

    // Criar um Pagamento correspondente à venda, para entrar no relatório financeiro
    await Pagamento.create({
      mensalidadeId: null, // venda não está ligada a mensalidade
      escolaId: escolaIdFinal,
      valor: totalLiquido,
      dataPagamento: new Date(),
      metodo: 'VENDA',
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'Venda registrada com sucesso', vendaId: venda.id, totalLiquido });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Erro ao registrar venda', details: error.message });
  }
};

exports.listarVendas = async (req, res) => {
  try {
    const escolaId = req.query.escolaId || req.user?.escolaId;
    const where = {};
    if (escolaId) where.escolaId = escolaId;

    const vendas = await Venda.findAll({
      where,
      include: [{ model: VendaItem, as: 'itens', include: [{ model: Produto, as: 'produto' }] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(vendas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar vendas', details: error.message });
  }
};

exports.obterVenda = async (req, res) => {
  try {
    const venda = await Venda.findByPk(req.params.id, {
      include: [{ model: VendaItem, as: 'itens', include: [{ model: Produto, as: 'produto' }] }],
    });
    if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });
    res.json(venda);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter venda', details: error.message });
  }
};
