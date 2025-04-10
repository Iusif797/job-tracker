const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const auth = require("../middleware/auth");

// Все маршруты требуют аутентификации
router.use(auth);

// Получение всех заявок пользователя
router.get("/", applicationController.getApplications);

// Создание новой заявки
router.post("/", applicationController.createApplication);

// Получение заявки по ID
router.get("/:id", applicationController.getApplicationById);

// Обновление заявки
router.put("/:id", applicationController.updateApplication);

// Удаление заявки
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;
