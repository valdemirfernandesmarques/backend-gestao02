// backend/models/Matricula.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Matricula = sequelize.define('Matricula', {
  dataMatricula: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'matriculas'
});

module.exports = Matricula;
