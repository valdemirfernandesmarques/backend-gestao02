const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Professor = sequelize.define('Professor', {
    // --- Informações Pessoais ---
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nomeCompleto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    rg: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // --- Informações de Contato ---
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cep: { type: DataTypes.STRING },
    logradouro: { type: DataTypes.STRING },
    numero: { type: DataTypes.STRING },
    complemento: { type: DataTypes.STRING },
    bairro: { type: DataTypes.STRING },
    cidade: { type: DataTypes.STRING },
    estado: { type: DataTypes.STRING(2) },
    
    // --- Formação e Qualificações ---
    formacao: {
        type: DataTypes.TEXT, // TEXT para descrições mais longas
        comment: 'Ex: Licenciatura em Dança, Cursos Livres, etc.'
    },
    modalidadesDominadas: {
        type: DataTypes.TEXT,
        comment: 'Lista das modalidades que o professor domina'
    },

    // --- Dados Profissionais na Escola ---
    regimeContratacao: {
        // ENUM só aceita os valores que definimos. Ótimo para opções fixas.
        type: DataTypes.ENUM('CLT', 'Autônomo', 'Comissão', 'Freelancer'),
        allowNull: false
    },
    valorPagamento: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Armazena o valor (salário, valor/hora ou % da comissão)'
    },

    // --- Observações ---
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    // Os campos de Foto e Documentos serão adicionados no futuro,
    // pois exigem um sistema de upload de arquivos.

}, {
    tableName: 'professores'
});

module.exports = Professor;