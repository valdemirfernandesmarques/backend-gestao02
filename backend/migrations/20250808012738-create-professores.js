'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('professores', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nomeCompleto: { type: Sequelize.STRING, allowNull: false },
      dataNascimento: { type: Sequelize.DATEONLY, allowNull: true },
      genero: { type: Sequelize.STRING, allowNull: true },
      cpf: { type: Sequelize.STRING, allowNull: true, unique: true },
      rg: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      telefone: { type: Sequelize.STRING, allowNull: false },
      cep: { type: Sequelize.STRING },
      logradouro: { type: Sequelize.STRING },
      numero: { type: Sequelize.STRING },
      complemento: { type: Sequelize.STRING },
      bairro: { type: Sequelize.STRING },
      cidade: { type: Sequelize.STRING },
      estado: { type: Sequelize.STRING(2) },
      formacao: { type: Sequelize.TEXT },
      modalidadesDominadas: { type: Sequelize.TEXT },
      regimeContratacao: { type: Sequelize.ENUM('CLT', 'Autônomo', 'Comissão', 'Freelancer'), allowNull: false },
      valorPagamento: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      observacoes: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('professores');
  }
};