// backend/models/Mensalidade.js
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Mensalidade extends Model {}

  Mensalidade.init(
    {
      matriculaId: { type: DataTypes.INTEGER, allowNull: false },
      valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      dataVencimento: { type: DataTypes.DATE, allowNull: false },
      status: {
        type: DataTypes.ENUM("ABERTA", "PAGA", "ATRASADA"),
        defaultValue: "ABERTA"
      }
    },
    {
      sequelize,
      modelName: "Mensalidade",
      tableName: "mensalidades"
    }
  );

  return Mensalidade;
};
