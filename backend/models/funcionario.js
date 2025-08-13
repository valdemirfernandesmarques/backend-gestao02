'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Funcionario = sequelize.define('Funcionario', {
  nomeCompleto: { type: DataTypes.STRING },
  nomeSocial: { type: DataTypes.STRING },
  dataNascimento: { type: DataTypes.DATEONLY },
  nacionalidade: { type: DataTypes.STRING },
  naturalidade: { type: DataTypes.STRING },
  estadoCivil: { type: DataTypes.STRING },
  genero: { type: DataTypes.STRING },
  cpf: { type: DataTypes.STRING },
  rg: { type: DataTypes.STRING },
  nomeMae: { type: DataTypes.STRING },
  nomePai: { type: DataTypes.STRING },
  telefone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  cep: { type: DataTypes.STRING },
  logradouro: { type: DataTypes.STRING },
  numero: { type: DataTypes.STRING },
  bairro: { type: DataTypes.STRING },
  cidade: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING },
  cargo: { type: DataTypes.STRING },
  departamento: { type: DataTypes.STRING },
  dataAdmissao: { type: DataTypes.DATEONLY },
  salario: { type: DataTypes.DECIMAL(10, 2) },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'funcionarios'
});

module.exports = Funcionario;