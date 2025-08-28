const Pagamento = require('../models/Pagamento');
const Mensalidade = require('../models/Mensalidade');

module.exports = {
  // Registrar um novo pagamento
  async registrarPagamento(req, res) {
    try {
      const { mensalidadeId, valor, dataPagamento, metodo } = req.body;

      const mensalidade = await Mensalidade.findByPk(mensalidadeId);

      if (!mensalidade) {
        return res.status(404).json({ error: 'Mensalidade não encontrada' });
      }

      // Criar pagamento
      const pagamento = await Pagamento.create({
        mensalidadeId,
        valor,
        dataPagamento,
        metodo
      });

      // Atualizar status da mensalidade
      mensalidade.status = 'PAGA';
      await mensalidade.save();

      res.status(201).json({
        message: 'Pagamento registrado com sucesso!',
        pagamento
      });
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      res.status(500).json({ error: 'Erro ao registrar pagamento', details: error.message });
    }
  },

  // Listar pagamentos
  async listarPagamentos(req, res) {
    try {
      const pagamentos = await Pagamento.findAll({
        include: [{ model: Mensalidade }]
      });

      res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      res.status(500).json({ error: 'Erro ao listar pagamentos', details: error.message });
    }
  }
};
