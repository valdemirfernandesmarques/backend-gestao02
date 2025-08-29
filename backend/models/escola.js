// backend/models/Escola.js
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Escola extends Model {}

  Escola.init(
    {
      nome: { type: DataTypes.STRING, allowNull: false },
      inicioPeriodoTeste: { type: DataTypes.DATE, allowNull: true },
      isencaoAtiva: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {
      sequelize,
      modelName: "Escola",
      tableName: "escolas"
    }
  );

  return Escola;
};
