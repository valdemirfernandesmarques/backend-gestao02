// backend/models/Mensalidade.js
module.exports = (sequelize, DataTypes) => {
  const Mensalidade = sequelize.define(
    'Mensalidade',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      valor: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      dataVencimento: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('ATIVA', 'PAGA', 'CANCELADA', 'PENDENTE'),
        allowNull: false,
        defaultValue: 'ATIVA',
      },
      // Definindo explicitamente a FK aqui melhora a sincronização
      matriculaId: {
        type: DataTypes.INTEGER,
        allowNull: false, // não permite "órfãos"
        references: {
          model: 'Matriculas',
          key: 'id',
        },
      },
    },
    {
      tableName: 'Mensalidades',
      timestamps: true,
    }
  );

  Mensalidade.associate = (models) => {
    // Quando a associação é declarada aqui com onDelete/onUpdate,
    // o Sequelize tende a gerar a FK com as ações corretas.
    Mensalidade.belongsTo(models.Matricula, {
      foreignKey: 'matriculaId',
      as: 'matricula',
      onDelete: 'RESTRICT', // previne exclusão da matrícula enquanto houver mensalidades
      onUpdate: 'CASCADE',
    });
  };

  return Mensalidade;
};
