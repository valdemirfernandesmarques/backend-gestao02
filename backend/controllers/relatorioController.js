const db = require("../models");
const { Op } = require("sequelize");

// Util: normaliza datas vindo em string YYYY-MM-DD para objetos Date (início/fim do dia)
function parseDateOrDefault(value, fallback) {
  if (!value) return fallback;
  const d = new Date(value);
  if (isNaN(d.getTime())) return fallback;
  return d;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

// ===== Escola: consolida Pagamentos + Vendas no período =====
async function relatorioFinanceiroEscola(req, res) {
  try {
    const hoje = new Date();
    const padraoInicio = startOfDay(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
    const padraoFim = endOfDay(hoje);

    const inicio = startOfDay(parseDateOrDefault(req.query.inicio, padraoInicio));
    const fim = endOfDay(parseDateOrDefault(req.query.fim, padraoFim));

    // escolaId pode vir do token (req.user.escolaId) ou querystring
    const escolaId = Number(req.query.escolaId || req.user?.escolaId);
    if (!escolaId) {
      return res.status(400).json({ error: "escolaId é obrigatório (no token ou na query)." });
    }

    // Pagamentos (ex.: mensalidades) no período
    const pagamentos = await db.Pagamento.findAll({
      where: {
        escolaId,
        createdAt: { [Op.between]: [inicio, fim] },
      },
      attributes: ["id", "valor", "createdAt"],
      order: [["id", "ASC"]],
    });

    const totalPagamentos = pagamentos.reduce((acc, p) => acc + Number(p.valor || 0), 0);

    // Vendas de produtos no período (se você atrela venda à escola via usuário/comprador, adapte)
    const vendas = await db.Venda.findAll({
      where: {
        createdAt: { [Op.between]: [inicio, fim] },
      },
      include: [
        { model: db.Produto, attributes: ["id", "nome"] },
        { model: db.User, attributes: ["id", "nome", "escolaId"] },
      ],
      order: [["id", "ASC"]],
    });

    // Se quiser filtrar por escola através do comprador (caso a relação seja essa)
    const vendasDaEscola = vendas.filter(v => v.comprador?.escolaId === escolaId);

    const totalVendas = vendasDaEscola.reduce((acc, v) => acc + Number(v.valor || v.total || 0), 0);

    const receitaBruta = totalPagamentos + totalVendas;

    // Cálculo de taxa 1,3% (aplicação real depende da regra de trial;
    // aqui mostramos o campo e o cálculo — adapte a regra quando o trial expirar).
    const TAXA = 0.013;
    const totalTaxas = Math.round(receitaBruta * TAXA * 100) / 100;
    const receitaLiquida = Math.round((receitaBruta - totalTaxas) * 100) / 100;

    return res.json({
      periodo: {
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
      },
      escola: { id: escolaId },
      receitaBruta,
      totalTaxas,
      receitaLiquida,
      detalhes: {
        pagamentos: pagamentos.map(p => ({
          pagamentoId: p.id,
          valor: Number(p.valor || 0),
          data: p.createdAt,
        })),
        vendas: vendasDaEscola.map(v => ({
          vendaId: v.id,
          produto: v.Produto?.nome || null,
          valor: Number(v.valor || v.total || 0),
          data: v.createdAt,
        })),
      },
    });
  } catch (err) {
    console.error("❌ Erro no relatorioFinanceiroEscola:", err);
    return res.status(500).json({ error: "Erro ao gerar relatório financeiro (escola)" });
  }
}

// ===== Superadmin: consolida todas as escolas =====
async function relatorioFinanceiroSuperadmin(req, res) {
  try {
    const hoje = new Date();
    const padraoInicio = startOfDay(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
    const padraoFim = endOfDay(hoje);

    const inicio = startOfDay(parseDateOrDefault(req.query.inicio, padraoInicio));
    const fim = endOfDay(parseDateOrDefault(req.query.fim, padraoFim));

    // Somatório global de pagamentos
    const pagamentos = await db.Pagamento.findAll({
      where: { createdAt: { [Op.between]: [inicio, fim] } },
      attributes: ["id", "valor", "escolaId", "createdAt"],
      order: [["id", "ASC"]],
    });

    const totalPagamentos = pagamentos.reduce((acc, p) => acc + Number(p.valor || 0), 0);

    // Somatório global de vendas
    const vendas = await db.Venda.findAll({
      where: { createdAt: { [Op.between]: [inicio, fim] } },
      include: [{ model: db.Produto, attributes: ["id", "nome"] }],
      order: [["id", "ASC"]],
    });

    const totalVendas = vendas.reduce((acc, v) => acc + Number(v.valor || v.total || 0), 0);

    const receitaBruta = totalPagamentos + totalVendas;
    const TAXA = 0.013;
    const totalTaxas = Math.round(receitaBruta * TAXA * 100) / 100;
    const receitaLiquida = Math.round((receitaBruta - totalTaxas) * 100) / 100;

    return res.json({
      periodo: {
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
      },
      receitaBruta,
      totalTaxas,
      receitaLiquida,
      resumo: {
        qtdPagamentos: pagamentos.length,
        qtdVendas: vendas.length,
      },
    });
  } catch (err) {
    console.error("❌ Erro no relatorioFinanceiroSuperadmin:", err);
    return res.status(500).json({ error: "Erro ao gerar relatório financeiro (superadmin)" });
  }
}

module.exports = {
  relatorioFinanceiroEscola,
  relatorioFinanceiroSuperadmin,
};
