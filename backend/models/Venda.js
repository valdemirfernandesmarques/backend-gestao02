const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Venda extends Model {
    static associate(models) {
      // Uma venda pertence a um produto
      Venda.belongsTo(models.Produto, { foreignKey: "produtoId", as: "produto" });
    }
  }

  Venda.init(
    {
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      valorTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Venda",
      tableName: "vendas",
    }
  );

  return Venda;
};
