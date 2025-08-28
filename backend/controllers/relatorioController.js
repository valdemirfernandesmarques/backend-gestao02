// backend/controllers/relatorioController.js
const { Pagamento, Comissao, Escola } = require('../models');
const { Op } = require('sequelize');

// Função auxiliar: aplica taxa de 1,3% somente após 6 dias do início
function calcularTaxa(pagamento, inicioPeriodoTeste, isencaoAtiva) {
  if (!inicioPeriodoTeste) return 0;

  const diasDeUso = Math.floor(
    (new Date(pagamento.dataPagamento) - new Date(inicioPeriodoTeste)) / (1000 * 60 * 60 * 24)
  );

  if (diasDeUso <= 6 || isencaoAtiva) {
    return 0; // dentro do período de teste ou isento
  }

  return parseFloat(pagamento.valor) * 0.013; // taxa de 1,3%
}

exports.relatorioFinanceiro = async (req, res) => {
  try {
    const { escolaId, inicio, fim } = req.query;

    const escola = await Escola.findByPk(escolaId);
    if (!escola) {
      return res.status(404).json({ error: "Escola não encontrada" });
    }

    const pagamentos = await Pagamento.findAll({
      where: {
        escolaId,
        dataPagamento: {
          [Op.between]: [new Date(inicio), new Date(fim)]
        }
      },
      include: [{ model: Comissao, as: 'comissoes' }]
    });

    let receitaBruta = 0;
    let totalTaxas = 0;
    let totalComissoes = 0;

    const detalhes = pagamentos.map(p => {
      const taxa = calcularTaxa(p, escola.inicioPeriodoTeste, escola.isencaoAtiva);
      const comissoes = p.comissoes?.reduce((sum, c) => sum + parseFloat(c.valor), 0) || 0;

      receitaBruta += parseFloat(p.valor);
      totalTaxas += taxa;
      totalComissoes += comissoes;

      return {
        pagamentoId: p.id,
        valorBruto: parseFloat(p.valor),
        taxaAplicada: taxa,
        comissoes,
        valorLiquido: parseFloat(p.valor) - taxa - comissoes
      };
    });

    const receitaLiquida = receitaBruta - totalTaxas - totalComissoes;

    res.json({
      periodo: { inicio, fim },
      escola: { id: escola.id, nome: escola.nome },
      receitaBruta,
      totalTaxas,
      totalComissoes,
      receitaLiquida,
      detalhes
    });

  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar relatório", details: error.message });
  }
};

// Emissão simulada de Nota Fiscal
exports.gerarNotaFiscal = async (req, res) => {
  try {
    const { pagamentoId, tipoPessoa, cpfCnpj, razaoSocial, endereco } = req.body;

    const pagamento = await Pagamento.findByPk(pagamentoId);
    if (!pagamento) {
      return res.status(404).json({ error: "Pagamento não encontrado" });
    }

    const notaFiscal = {
      numero: "NF-" + new Date().getTime(),
      pagamentoId: pagamento.id,
      valor: pagamento.valor,
      dataEmissao: new Date(),
      tipoPessoa,
      cpfCnpj,
      razaoSocial,
      endereco
    };

    res.json({ message: "Nota fiscal gerada com sucesso (simulação)", notaFiscal });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar nota fiscal", details: error.message });
  }
};
