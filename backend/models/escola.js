// backend/models/Escola.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Escola = sequelize.define('Escola', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  inicioPeriodoTeste: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'escolas'
});

module.exports = Escola;
