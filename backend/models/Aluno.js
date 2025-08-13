const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Aluno = sequelize.define('Aluno', {
    // --- Informações Pessoais do Aluno ---
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nomeCompleto: { type: DataTypes.STRING, allowNull: false },
    dataNascimento: { type: DataTypes.DATEONLY, allowNull: false },
    genero: { type: DataTypes.STRING, allowNull: true },
    cpf: { type: DataTypes.STRING, allowNull: true, unique: true },
    rg: { type: DataTypes.STRING, allowNull: true },
    
    // --- Informações de Contato do Aluno ---
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefone: { type: DataTypes.STRING, allowNull: false },
    cep: { type: DataTypes.STRING },
    logradouro: { type: DataTypes.STRING },
    numero: { type: DataTypes.STRING },
    complemento: { type: DataTypes.STRING },
    bairro: { type: DataTypes.STRING },
    cidade: { type: DataTypes.STRING },
    estado: { type: DataTypes.STRING(2) },
    
    // --- Dados do Responsável Legal (se menor) ---
    nomeResponsavel: { type: DataTypes.STRING, allowNull: true },
    cpfResponsavel: { type: DataTypes.STRING, allowNull: true },
    telefoneResponsavel: { type: DataTypes.STRING, allowNull: true },
    emailResponsavel: { type: DataTypes.STRING, allowNull: true },

    // --- Contato de Emergência ---
    contatoEmergenciaNome: { type: DataTypes.STRING, allowNull: true },
    contatoEmergenciaTelefone: { type: DataTypes.STRING, allowNull: true },
    
    // --- Informações Financeiras ---
    planoPagamento: { 
        type: DataTypes.ENUM('Mensal', 'Trimestral', 'Semestral', 'Anual'), 
        allowNull: true 
    },
    formaPagamento: { 
        type: DataTypes.ENUM('Dinheiro', 'Pix', 'Cartão', 'Boleto'), 
        allowNull: true 
    },
    
    // --- Informações de Saúde ---
    condicaoMedica: { type: DataTypes.TEXT, allowNull: true },
    medicacaoContinua: { type: DataTypes.TEXT, allowNull: true },
    alergias: { type: DataTypes.TEXT, allowNull: true },
    
    // --- Termos e Status ---
    termoCompromissoAceito: { type: DataTypes.BOOLEAN, defaultValue: false },
    usoImagemAceito: { type: DataTypes.BOOLEAN, defaultValue: false },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },

    // Os campos de Documentação (anexos) serão tratados no futuro
    // com um sistema de upload de arquivos.

}, {
    tableName: 'alunos'
});

module.exports = Aluno;