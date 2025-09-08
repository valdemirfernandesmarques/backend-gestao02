// backend/models/Pagamento.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Pagamento", {
    mensalidadeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dataPagamento: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    metodo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
