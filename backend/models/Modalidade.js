// backend/models/Modalidade.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Modalidade = sequelize.define('Modalidade', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'modalidades'
});

module.exports = Modalidade;
