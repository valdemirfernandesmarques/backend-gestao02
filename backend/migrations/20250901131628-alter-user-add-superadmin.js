"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "perfil", {
      type: Sequelize.ENUM("SUPER_ADMIN", "ADMIN", "USER"), // ✅ adiciona SUPER_ADMIN
      allowNull: false,
      defaultValue: "USER",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "perfil", {
      type: Sequelize.ENUM("ADMIN", "USER"), // 🔙 remove SUPER_ADMIN se der rollback
      allowNull: false,
      defaultValue: "USER",
    });
  },
};
