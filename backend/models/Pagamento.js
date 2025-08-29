// backend/models/Pagamento.js
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Pagamento extends Model {}

  Pagamento.init(
    {
      mensalidadeId: { type: DataTypes.INTEGER, allowNull: true },
      escolaId: { type: DataTypes.INTEGER, allowNull: true }, // usado no relatório por escola
      valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      dataPagamento: { type: DataTypes.DATE, allowNull: false },
      metodo: { type: DataTypes.STRING, allowNull: true } // 'PIX', 'CARTAO', etc.
    },
    {
      sequelize,
      modelName: "Pagamento",
      tableName: "pagamentos"
    }
  );

  return Pagamento;
};
