'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Comando para adicionar a coluna 'senhaResetToken'
    await queryInterface.addColumn('usuarios', 'senhaResetToken', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'perfil' // Opcional: define a posição da nova coluna
    });

    // Comando para adicionar a coluna 'senhaResetExpires'
    await queryInterface.addColumn('usuarios', 'senhaResetExpires', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'senhaResetToken' // Coloca esta coluna depois da anterior
    });
  },

  async down(queryInterface, Sequelize) {
    // Comando para remover a coluna 'senhaResetToken'
    await queryInterface.removeColumn('usuarios', 'senhaResetToken');
    // Comando para remover a coluna 'senhaResetExpires'
    await queryInterface.removeColumn('usuarios', 'senhaResetExpires');
  }
};