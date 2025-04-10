const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Регистрация нового пользователя
router.post("/register", userController.registerUser);

// Аутентификация пользователя
router.post("/login", userController.loginUser);

// Получение профиля пользователя (требует аутентификации)
router.get("/profile", auth, userController.getUserProfile);

// Обновление профиля пользователя (требует аутентификации)
router.put("/profile", auth, userController.updateUserProfile);

module.exports = router;
