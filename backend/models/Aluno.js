// backend/models/Aluno.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Aluno = sequelize.define('Aluno', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dataNascimento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  emailResponsavel: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'alunos'
});

module.exports = Aluno;
