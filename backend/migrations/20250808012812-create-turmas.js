'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('turmas', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nome: { type: Sequelize.STRING, allowNull: false },
      horarioInicio: { type: Sequelize.TIME, allowNull: false },
      horarioFim: { type: Sequelize.TIME, allowNull: false },
      diaDaSemana: { type: Sequelize.STRING, allowNull: false },
      maxAlunos: { type: Sequelize.INTEGER, allowNull: true },
      professorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'professores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      modalidadeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'modalidades', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('turmas');
  }
};