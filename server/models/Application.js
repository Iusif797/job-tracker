const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

// Определение модели заявки
const Application = sequelize.define(
  "Application",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Название компании обязательно",
        },
      },
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Название позиции обязательно",
        },
      },
    },
    platform: {
      type: DataTypes.ENUM(
        "LinkedIn",
        "HeadHunter",
        "Glassdoor",
        "Indeed",
        "Other"
      ),
      defaultValue: "Other",
    },
    status: {
      type: DataTypes.ENUM(
        "Отправлена",
        "Рассматривается",
        "Интервью",
        "Оффер",
        "Отказ"
      ),
      defaultValue: "Отправлена",
    },
    url: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    responseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    salary: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    contactEmail: {
      type: DataTypes.STRING,
    },
    contactPhone: {
      type: DataTypes.STRING,
    },
    contactPerson: {
      type: DataTypes.STRING,
    },
    companySize: {
      type: DataTypes.ENUM("Маленькая", "Средняя", "Большая", "Неизвестно"),
      defaultValue: "Неизвестно",
    },
    experienceRequired: {
      type: DataTypes.ENUM("Начальный", "Средний", "Высокий", "Неизвестно"),
      defaultValue: "Неизвестно",
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    folder: {
      type: DataTypes.STRING,
      defaultValue: "responses",
    },
    // Ссылка на пользователя
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "applications",
  }
);

// Определение модели для интервью
const Interview = sequelize.define(
  "Interview",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Телефонное", "Видео", "Личное", "Техническое"),
    },
    notes: {
      type: DataTypes.TEXT,
    },
    result: {
      type: DataTypes.ENUM("Успешно", "Неуспешно", "В ожидании", "Отменено"),
      defaultValue: "В ожидании",
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "applications",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "interviews",
  }
);

// Определяем связи между моделями
Application.belongsTo(User, { foreignKey: "userId", as: "owner" });
User.hasMany(Application, { foreignKey: "userId", as: "applications" });

Application.hasMany(Interview, {
  foreignKey: "applicationId",
  as: "interviews",
});
Interview.belongsTo(Application, { foreignKey: "applicationId" });

module.exports = { Application, Interview };
