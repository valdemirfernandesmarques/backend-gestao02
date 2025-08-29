// backend/models/Matricula.js
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Matricula extends Model {}

  Matricula.init(
    {
      alunoNome: { type: DataTypes.STRING, allowNull: true },
      escolaId: { type: DataTypes.INTEGER, allowNull: true }
    },
    {
      sequelize,
      modelName: "Matricula",
      tableName: "matriculas"
    }
  );

  return Matricula;
};
