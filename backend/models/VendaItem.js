// backend/models/VendaItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VendaItem = sequelize.define('VendaItem', {
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precoUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  tableName: 'venda_itens'
});

module.exports = VendaItem;
