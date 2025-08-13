'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'escolaId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Permitimos nulo, pois o SUPER_ADMIN não pertence a nenhuma escola
      references: {
        model: 'escolas', // Nome da tabela de escolas
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'escolaId');
  }
};