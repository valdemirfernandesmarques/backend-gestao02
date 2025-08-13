'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('funcionarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomeCompleto: { type: Sequelize.STRING },
      nomeSocial: { type: Sequelize.STRING },
      dataNascimento: { type: Sequelize.DATEONLY },
      nacionalidade: { type: Sequelize.STRING },
      naturalidade: { type: Sequelize.STRING },
      estadoCivil: { type: Sequelize.STRING },
      genero: { type: Sequelize.STRING },
      cpf: { type: Sequelize.STRING },
      rg: { type: Sequelize.STRING },
      nomeMae: { type: Sequelize.STRING },
      nomePai: { type: Sequelize.STRING },
      telefone: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      cep: { type: Sequelize.STRING },
      logradouro: { type: Sequelize.STRING },
      numero: { type: Sequelize.STRING },
      bairro: { type: Sequelize.STRING },
      cidade: { type: Sequelize.STRING },
      estado: { type: Sequelize.STRING },
      cargo: { type: Sequelize.STRING },
      departamento: { type: Sequelize.STRING },
      dataAdmissao: { type: Sequelize.DATEONLY },
      salario: { type: Sequelize.DECIMAL(10, 2) },
      ativo: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('funcionarios');
  }
};