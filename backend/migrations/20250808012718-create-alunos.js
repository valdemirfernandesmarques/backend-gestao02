'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('alunos', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nomeCompleto: { type: Sequelize.STRING, allowNull: false },
      dataNascimento: { type: Sequelize.DATEONLY, allowNull: false },
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
      nomeResponsavel: { type: Sequelize.STRING, allowNull: true },
      cpfResponsavel: { type: Sequelize.STRING, allowNull: true },
      telefoneResponsavel: { type: Sequelize.STRING, allowNull: true },
      emailResponsavel: { type: Sequelize.STRING, allowNull: true },
      contatoEmergenciaNome: { type: Sequelize.STRING, allowNull: true },
      contatoEmergenciaTelefone: { type: Sequelize.STRING, allowNull: true },
      planoPagamento: { type: Sequelize.ENUM('Mensal', 'Trimestral', 'Semestral', 'Anual') },
      formaPagamento: { type: Sequelize.ENUM('Dinheiro', 'Pix', 'Cartão', 'Boleto') },
      condicaoMedica: { type: Sequelize.TEXT },
      medicacaoContinua: { type: Sequelize.TEXT },
      alergias: { type: Sequelize.TEXT },
      termoCompromissoAceito: { type: Sequelize.BOOLEAN, defaultValue: false },
      usoImagemAceito: { type: Sequelize.BOOLEAN, defaultValue: false },
      ativo: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('alunos');
  }
};