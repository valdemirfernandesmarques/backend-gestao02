// backend/models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  perfil: {
    type: DataTypes.ENUM("admin", "professor", "aluno"),
    defaultValue: "aluno",
  },
  escolaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = User;
