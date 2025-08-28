// backend/models/Turma.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Turma = sequelize.define('Turma', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  horario: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'turmas'
});

module.exports = Turma;
