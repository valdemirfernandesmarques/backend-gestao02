// backend/controllers/relatorioController.js
const Pagamento = require('../models/Pagamento');
const Comissao = require('../models/Comissao');
const Professor = require('../models/Professor');
const { Op } = require('sequelize');

// Relatório financeiro geral
exports.financeiroGeral = async (req, res) => {
  try {
    const { inicio, fim } = req.query; // datas opcionais no formato YYYY-MM-DD
    const filtroDatas = {};

    if (inicio && fim) {
      filtroDatas.dataPagamento = { [Op.between]: [inicio, fim] };
    }

    // Total recebido (faturamento)
    const pagamentos = await Pagamento.findAll({ where: filtroDatas });
    const totalRecebido = pagamentos.reduce((acc, p) => acc + parseFloat(p.valor), 0);

    // Total de comissões
    const comissoes = await Comissao.findAll({
      include: [{ model: Professor, as: 'professor' }]
    });
    const totalComissoes = comissoes.reduce((acc, c) => acc + parseFloat(c.valor), 0);

    const lucroLiquido = totalRecebido - totalComissoes;

    res.json({
      periodo: inicio && fim ? `${inicio} até ${fim}` : 'Todos os registros',
      totalRecebido,
      totalComissoes,
      lucroLiquido
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório financeiro', details: error.message });
  }
};

// Relatório financeiro por professor
exports.financeiroPorProfessor = async (req, res) => {
  try {
    const { inicio, fim } = req.query;
    const filtroDatas = {};

    if (inicio && fim) {
      filtroDatas.dataPagamento = { [Op.between]: [inicio, fim] };
    }

    const comissoes = await Comissao.findAll({
      where: filtroDatas,
      include: [{ model: Professor, as: 'professor' }]
    });

    // Agrupar por professor
    const relatorio = {};
    comissoes.forEach(c => {
      const profId = c.professorId;
      if (!relatorio[profId]) {
        relatorio[profId] = {
          professorId: profId,
          nome: c.professor ? c.professor.nome : 'Professor não encontrado',
          totalComissao: 0
        };
      }
      relatorio[profId].totalComissao += parseFloat(c.valor);
    });

    res.json(Object.values(relatorio));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório por professor', details: error.message });
  }
};
