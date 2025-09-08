// backend/models/Produto.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Produto", {
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
      allowNull: false,
    },
  });
};
