// backend/models/Matricula.js
module.exports = (sequelize, DataTypes) => {
  const Matricula = sequelize.define('Matricula', {
    dataInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'ATIVA',
    },
  });

  Matricula.associate = (models) => {
    Matricula.belongsTo(models.Aluno, {
      foreignKey: 'alunoId',
      as: 'aluno',
    });
    Matricula.belongsTo(models.Escola, {
      foreignKey: 'escolaId',
      as: 'escola',
    });
    Matricula.hasMany(models.Mensalidade, {
      foreignKey: 'matriculaId',
      as: 'mensalidades',
    });
  };

  return Matricula;
};
