const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "mysecrettoken123", {
    expiresIn: "30d",
  });
};

// Регистрация нового пользователя
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверка, существует ли пользователь с таким email
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    // Создание нового пользователя
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user.id);
      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ message: "Некорректные данные пользователя" });
    }
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

// Аутентификация пользователя
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя по email с явным включением пароля
    const user = await User.findOne({
      where: { email },
      attributes: { include: ["password"] },
    });

    if (!user) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    // Проверка пароля с bcrypt напрямую
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = generateToken(user.id);
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ message: "Неверный email или пароль" });
    }
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

// Получение профиля пользователя
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: "Пользователь не найден" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

// Обновление профиля пользователя
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      const token = generateToken(updatedUser.id);
      res.json({
        token,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      });
    } else {
      res.status(404).json({ message: "Пользователь не найден" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};
