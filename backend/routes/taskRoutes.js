const express = require("express");
const multer = require("multer");
const path = require("path");

const Task = require("../models/Task");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }

});

const upload = multer({

  storage,

  fileFilter: function (req, file, cb) {

    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDFs allowed"));
    }

    cb(null, true);

  }

});

// CREATE TASK

router.post(
  "/",
  authMiddleware,
  upload.array("documents", 3),

  async (req, res) => {

    try {

      const documents = req.files
        ? req.files.map(file => file.filename)
        : [];

      const task = await Task.create({

        title: req.body.title,

        description: req.body.description,

        status: req.body.status,

        priority: req.body.priority,

        assignedTo: req.user.id,

        documents

      });

      res.status(201).json(task);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

});


// GET TASKS

router.get("/", authMiddleware, async (req, res) => {

  try {

    const tasks = await Task.find({
      assignedTo: req.user.id
    });

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});
// UPDATE TASK

router.put("/:id", authMiddleware, async (req, res) => {

  try {

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// DELETE TASK

router.delete("/:id", authMiddleware, async (req, res) => {

  try {

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task Deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});
module.exports = router;