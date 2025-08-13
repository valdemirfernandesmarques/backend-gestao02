const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LogAtividade = sequelize.define('LogAtividade', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Descrição da ação realizada. Ex: O usuário X deletou a turma Y.'
    },
    // Chave estrangeira para saber QUEM fez a ação
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    }
    // O campo 'createdAt' será adicionado automaticamente pelo Sequelize,
    // nos dando a data e hora exatas da ação.
}, {
    tableName: 'log_atividades'
});

module.exports = LogAtividade;