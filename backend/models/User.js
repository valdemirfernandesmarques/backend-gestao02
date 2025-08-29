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
    password: { // 👈 usamos SEMPRE "password" para bater com o controller
      type: DataTypes.STRING,
      allowNull: false,
    },
    perfil: {
      type: DataTypes.ENUM("ADMIN", "USER"),
      defaultValue: "USER",
    },
  });

  return User;
};
