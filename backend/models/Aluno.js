// backend/models/Aluno.js
module.exports = (sequelize, DataTypes) => {
  const Aluno = sequelize.define('Aluno', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    telefone: DataTypes.STRING,
  });

  Aluno.associate = (models) => {
    Aluno.hasMany(models.Matricula, {
      foreignKey: 'alunoId',
      as: 'matriculas',
    });
  };

  return Aluno;
};
