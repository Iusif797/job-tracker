const User = require("./User");
const { Application, Interview } = require("./Application");
const { sequelize } = require("../config/db");

// Функция для синхронизации всех моделей с базой данных
const syncDatabase = async (force = false) => {
  try {
    // force: true - пересоздает таблицы при каждом запуске приложения
    await sequelize.sync({ force });
    console.log("База данных синхронизирована");
  } catch (error) {
    console.error("Ошибка синхронизации базы данных:", error);
    process.exit(1);
  }
};

module.exports = {
  User,
  Application,
  Interview,
  syncDatabase,
};
