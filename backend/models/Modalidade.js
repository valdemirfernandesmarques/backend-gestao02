const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Modalidade = sequelize.define('Modalidade', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Ex: Dança de Salão, Ballet Clássico, Danças Urbanas'
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Uma breve descrição da modalidade, como no site de referência.'
    }
}, {
    tableName: 'modalidades'
});

module.exports = Modalidade;