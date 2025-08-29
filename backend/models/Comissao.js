// backend/models/Comissao.js
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comissao extends Model {}

  Comissao.init(
    {
      pagamentoId: { type: DataTypes.INTEGER, allowNull: false },
      tipo: { type: DataTypes.STRING, allowNull: false, defaultValue: "TAXA_SISTEMA" },
      valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    },
    {
      sequelize,
      modelName: "Comissao",
      tableName: "comissoes"
    }
  );

  return Comissao;
};
