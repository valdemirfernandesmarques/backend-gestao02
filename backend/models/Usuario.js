const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    perfil: {
        type: DataTypes.ENUM('SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE', 'PROFESSOR', 'ALUNO', 'RESPONSAVEL'),
        allowNull: false
    },
    // --- NOVOS CAMPOS PARA RECUPERAÇÃO DE SENHA ---
    senhaResetToken: {
        type: DataTypes.STRING,
        allowNull: true // Opcional, só terá valor quando uma recuperação for solicitada
    },
    senhaResetExpires: {
        type: DataTypes.DATE, // Armazena a data e hora de expiração do token
        allowNull: true
    }
}, {
    tableName: 'usuarios'
});

module.exports = Usuario;