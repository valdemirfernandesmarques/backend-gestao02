// backend/models/Mensalidade.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mensalidade = sequelize.define('Mensalidade', {
  valor: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  dataVencimento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ABERTA','PAGA','ATRASADA'),
    defaultValue: 'ABERTA'
  }
}, {
  tableName: 'mensalidades'
});

module.exports = Mensalidade;
