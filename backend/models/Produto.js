// backend/models/produto.js
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Produto extends Model {
    static associate(models) {
      // Um produto pode ter várias vendas
      Produto.hasMany(models.Venda, { foreignKey: "produtoId", as: "vendas" });
    }
  }

  Produto.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      escolaId: {
        type: DataTypes.INTEGER,
        allowNull: false, // obrigatório para relacionar com a escola
      },
    },
    {
      sequelize,
      modelName: "Produto",
      tableName: "produtos",
    }
  );

  return Produto;
};
