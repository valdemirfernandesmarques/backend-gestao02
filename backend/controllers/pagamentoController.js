// backend/controllers/pagamentoController.js
const { Pagamento, Mensalidade, Escola } = require('../models');

module.exports = {
  // Registrar um novo pagamento
  async registrarPagamento(req, res) {
    try {
      const { mensalidadeId, valor, dataPagamento, metodo } = req.body;

      const mensalidade = await Mensalidade.findByPk(mensalidadeId, {
        include: [{ model: Escola, attributes: ['id', 'nome'] }]
      });

      if (!mensalidade) {
        return res.status(404).json({ error: 'Mensalidade não encontrada' });
      }

      // Verifica permissões
      if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado: não pode registrar pagamento de outra escola' });
      }

      // Criar pagamento
      const pagamento = await Pagamento.create({
        mensalidadeId,
        valor,
        dataPagamento,
        metodo,
        escolaId: mensalidade.escolaId
      });

      // Atualizar status da mensalidade
      mensalidade.status = 'PAGA';
      await mensalidade.save();

      res.status(201).json({
        message: 'Pagamento registrado com sucesso!',
        pagamento,
        mensalidade
      });
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      res.status(500).json({ error: 'Erro ao registrar pagamento', details: error.message });
    }
  },

  // Listar pagamentos
  async listarPagamentos(req, res) {
    try {
      let where = {};

      // SUPER_ADMIN vê tudo, ADMIN_ESCOLA apenas da própria escola
      if (req.user.perfil === 'ADMIN_ESCOLA') {
        where.escolaId = req.user.escolaId;
      }

      const pagamentos = await Pagamento.findAll({
        where,
        include: [
          {
            model: Mensalidade,
            include: [{ model: Escola, attributes: ['id', 'nome'] }]
          }
        ]
      });

      res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      res.status(500).json({ error: 'Erro ao listar pagamentos', details: error.message });
    }
  }
};
