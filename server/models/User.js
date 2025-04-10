const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");

// Определение модели пользователя
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Имя обязательно",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Введите корректный email",
        },
        notEmpty: {
          msg: "Email обязателен",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: "Пароль должен быть не менее 6 символов",
        },
        notEmpty: {
          msg: "Пароль обязателен",
        },
      },
    },
  },
  {
    timestamps: true,
    tableName: "users",
    // Скрываем пароль при получении пользователя
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      // Скоуп для аутентификации, включает пароль
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
  }
);

// Хук перед созданием/обновлением - хеширует пароль
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Метод для проверки пароля
User.prototype.validatePassword = async function (password) {
  if (!this.password) {
    console.error("Ошибка: пароль пользователя не загружен");
    return false;
  }
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
