const { Pagamento, Escola } = require("../models");

// Relatório financeiro
exports.gerarRelatorioFinanceiro = async (req, res) => {
  try {
    const { inicio, fim, escolaId } = req.query;

    const escola = await Escola.findByPk(escolaId || 1);
    if (!escola) return res.status(404).json({ error: "Escola não encontrada" });

    const pagamentos = await Pagamento.findAll({
      where: {
        escolaId: escola.id,
        createdAt: { $between: [inicio, fim] },
      },
    });

    const receitaBruta = pagamentos.reduce((acc, p) => acc + parseFloat(p.valor), 0);
    const totalTaxas = 0;
    const receitaLiquida = receitaBruta - totalTaxas;

    res.json({
      periodo: { inicio, fim },
      escola: { id: escola.id, nome: escola.nome },
      receitaBruta,
      totalTaxas,
      receitaLiquida,
      detalhes: pagamentos.map((p) => ({
        pagamentoId: p.id,
        valorBruto: p.valor,
        taxaAplicada: 0,
        valorLiquido: p.valor,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar relatório", details: err.message });
  }
};

// Simular nota fiscal
exports.gerarNotaFiscalSimulada = async (req, res) => {
  try {
    const { pagamentoId, valor, tipoPessoa, cpfCnpj, razaoSocial, endereco } = req.body;

    res.json({
      message: "Nota fiscal gerada com sucesso (simulação)",
      notaFiscal: {
        numero: "NF-" + Date.now(),
        pagamentoId,
        valor: parseFloat(valor).toFixed(2),
        dataEmissao: new Date(),
        tipoPessoa,
        cpfCnpj,
        razaoSocial,
        endereco,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar nota fiscal", details: err.message });
  }
};
