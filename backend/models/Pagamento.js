const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pagamento = sequelize.define('Pagamento', {
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  dataPagamento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pendente', 'Pago', 'Atrasado', 'Cancelado'),
    allowNull: false,
    defaultValue: 'Pendente'
  },
  metodoPagamento: {
    type: DataTypes.ENUM('Dinheiro', 'Pix', 'Cartão', 'Boleto'),
    allowNull: true
  },
  alunoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  turmaId: {
    type: DataTypes.INTEGER,
    allowNull: true // Pode haver pagamentos não atrelados a uma turma específica (ex: taxa de matrícula)
  }
}, {
  tableName: 'pagamentos'
});

module.exports = Pagamento;