const { Sequelize } = require("sequelize");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// Параметры подключения к SQLite
const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "../../database.sqlite");

// Создаем подключение к SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_PATH,
  logging: false, // Отключаем логирование SQL-запросов
});

// Функция для подключения к базе данных
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Успешное подключение к SQLite базе данных");
  } catch (error) {
    console.error("Ошибка подключения к базе данных:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
