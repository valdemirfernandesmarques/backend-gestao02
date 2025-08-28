// backend/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  perfil: {
    type: DataTypes.ENUM('SUPER_ADMIN','ADMIN_ESCOLA','PROFESSOR','FUNCIONARIO','FINANCEIRO'),
    defaultValue: 'ADMIN_ESCOLA'
  }
}, {
  tableName: 'users'
});

module.exports = User;
