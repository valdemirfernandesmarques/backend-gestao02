const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Modalidade = sequelize.define(
    "Modalidade",
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      precoAula: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      escolaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "modalidades",
      timestamps: true,
    }
  );

  Modalidade.associate = (models) => {
    Modalidade.belongsTo(models.Escola, { foreignKey: "escolaId" });
  };

  return Modalidade;
};
