// backend/models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perfil: {
      type: DataTypes.ENUM("SUPER_ADMIN", "ADMIN", "USER"),
      allowNull: false,
      defaultValue: "USER",
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: true, // SUPER_ADMIN não precisa ter escola vinculada
      references: {
        model: "Escolas",
        key: "id",
      },
    },
  });

  return User;
};
