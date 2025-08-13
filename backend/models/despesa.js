'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Despesa = sequelize.define('Despesa', {
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  dataVencimento: {
    type: DataTypes.DATEONLY
  },
  dataPagamento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pendente'
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  professorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  funcionarioId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'despesas'
});

module.exports = Despesa;