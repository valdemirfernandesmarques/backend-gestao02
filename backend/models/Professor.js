// backend/models/Professor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Professor = sequelize.define('Professor', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'professores'
});

module.exports = Professor;
