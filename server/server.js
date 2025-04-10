const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const { syncDatabase } = require("./models");
const userRoutes = require("./routes/userRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

// Загрузка переменных окружения
dotenv.config();

// Подключение к базе данных
connectDB();

// Синхронизация моделей с базой данных (с пересозданием таблиц)
syncDatabase(true);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Маршруты
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);

// Базовый маршрут для проверки API
app.get("/", (req, res) => {
  res.json({ message: "API работает" });
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

// Порт сервера
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
