const { Venda, Pagamento } = require('../models');

// Relatório financeiro por escola
exports.relatorioFinanceiroEscola = async (req, res) => {
  try {
    // SUPER_ADMIN pode passar qualquer escolaId na query
    const escolaId = req.user.perfil === 'SUPER_ADMIN'
      ? req.query.escolaId
      : req.user?.escolaId;

    if (!escolaId) {
      return res.status(400).json({ error: 'escolaId é obrigatório (na query ou pelo usuário autenticado)' });
    }

    // Somatório das vendas + pagamentos
    const totalVendas = await Venda.sum('totalLiquido', { where: { escolaId } });
    const totalPagamentos = await Pagamento.sum('valor', { where: { escolaId } });

    res.json({
      escolaId,
      totalVendas: totalVendas || 0,
      totalPagamentos: totalPagamentos || 0,
      receitaTotal: (totalVendas || 0) + (totalPagamentos || 0),
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório financeiro da escola', details: error.message });
  }
};

// Relatório financeiro geral (todas escolas)
exports.relatorioFinanceiroGeral = async (req, res) => {
  try {
    // Somatório total por escola
    const vendas = await Venda.findAll({
      attributes: ['escolaId', [Venda.sequelize.fn('SUM', Venda.sequelize.col('totalLiquido')), 'totalVendas']],
      group: ['escolaId'],
    });

    const pagamentos = await Pagamento.findAll({
      attributes: ['escolaId', [Pagamento.sequelize.fn('SUM', Pagamento.sequelize.col('valor')), 'totalPagamentos']],
      group: ['escolaId'],
    });

    // ADMIN_ESCOLA filtra apenas sua escola
    if (req.user.perfil === 'ADMIN_ESCOLA') {
      const escolaId = req.user.escolaId;
      const vendasFiltradas = vendas.filter(v => v.escolaId === escolaId);
      const pagamentosFiltrados = pagamentos.filter(p => p.escolaId === escolaId);

      return res.json({
        vendas: vendasFiltradas,
        pagamentos: pagamentosFiltrados,
      });
    }

    // SUPER_ADMIN recebe tudo
    res.json({
      vendas,
      pagamentos,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório financeiro geral', details: error.message });
  }
};
