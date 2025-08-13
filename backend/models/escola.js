'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Escola = sequelize.define('Escola', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  telefone: {
    type: DataTypes.STRING
  },
  activationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gatewayAccountId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  onboardingCompleto: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'escolas'
});

module.exports = Escola;