const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Проверяем наличие токена в заголовке
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Не авторизован, нет токена" });
    }

    // Извлекаем токен из заголовка
    const token = authHeader.split(" ")[1];

    try {
      // Проверяем токен
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "mysecrettoken123"
      );

      // Ищем пользователя в базе данных
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "Пользователь не найден" });
      }

      // Добавляем данные пользователя в объект запроса
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Недействительный токен" });
    }
  } catch (error) {
    console.error("Ошибка в middleware авторизации:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

module.exports = auth;
