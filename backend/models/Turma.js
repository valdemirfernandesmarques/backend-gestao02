const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Turma = sequelize.define('Turma', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Ex: Turma de Segunda 18:30'
    },
    horarioInicio: {
        type: DataTypes.TIME, // 18:30:00
        allowNull: false
    },
    horarioFim: {
        type: DataTypes.TIME, // 20:00:00
        allowNull: false
    },
    diaDaSemana: {
        type: DataTypes.STRING,
        allowNull: false
    },
    maxAlunos: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    // --- CAMPO PARA A "PONTE" COM PROFESSORES ---
    professorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'professores', // Aponta para a tabela 'professores'
            key: 'id'           // A chave estrangeira é o 'id' da tabela de professores
        }
    },
    // --- CAMPO PARA A "PONTE" COM MODALIDADES ---
    modalidadeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'modalidades', // Aponta para a tabela 'modalidades'
            key: 'id'            // A chave estrangeira é o 'id' da tabela de modalidades
        }
    }
}, {
    tableName: 'turmas'
});

module.exports = Turma;