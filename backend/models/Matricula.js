const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Matricula = sequelize.define('Matricula', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // Chave estrangeira para Aluno
    alunoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'alunos',
            key: 'id'
        }
    },
    // Chave estrangeira para Turma
    turmaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'turmas',
            key: 'id'
        }
    },
    dataMatricula: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW // A data da matrícula é preenchida automaticamente
    }
}, {
    tableName: 'matriculas'
});

module.exports = Matricula;