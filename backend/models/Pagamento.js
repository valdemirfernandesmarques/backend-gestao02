// backend/models/Pagamento.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pagamento = sequelize.define('Pagamento', {
  valor: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  dataPagamento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  metodo: {
    type: DataTypes.ENUM('DINHEIRO','PIX','CARTAO'),
    allowNull: false
  }
}, {
  tableName: 'pagamentos'
});

module.exports = Pagamento;
