const Application = require("../models/Application");

// Получение всех заявок пользователя
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ owner: req.user._id });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

// Создание новой заявки
exports.createApplication = async (req, res) => {
  try {
    const application = new Application({
      ...req.body,
      owner: req.user._id,
    });

    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Ошибка при создании заявки", error: error.message });
  }
};

// Получение заявки по ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

// Обновление заявки
exports.updateApplication = async (req, res) => {
  try {
    console.log("Updating application with ID:", req.params.id);
    console.log("Update data:", req.body);

    const updateData = {
      ...req.body,
      // Убедимся, что поле folder тоже обновляется
      folder: req.body.folder || "responses",
    };

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!application) {
      console.log("Application not found");
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    console.log("Application updated successfully:", application);
    res.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    res
      .status(400)
      .json({ message: "Ошибка при обновлении заявки", error: error.message });
  }
};

// Удаление заявки
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    res.json({ message: "Заявка успешно удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};
