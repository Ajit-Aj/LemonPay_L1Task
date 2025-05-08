

import express from "express";
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} from "../controllers/taskController.js";

import { protect } from "../middleware/auth.js";
import { validateTask } from "../utils/helpers.js";
import { validationResult } from "express-validator";

const taskRouter = express.Router();

// Generic validation error handler middleware
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

// Routes
taskRouter.post("/create", protect, validateTask, handleValidation, createTask);
taskRouter.get("/getalltasks", protect, getTasks);
taskRouter.post("/update", protect, updateTask);
taskRouter.post("/delete", protect, deleteTask);

export default taskRouter;
