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
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Маршруты
app.use("/auth", userRoutes);
app.use("/api", applicationRoutes);

// Базовый маршрут для проверки API
app.get("/", (req, res) => {
  res.json({ message: "API работает" });
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Порт сервера
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
