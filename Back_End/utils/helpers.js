
import { body, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const Registervalidate = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

const LoginValidate = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const TaskValidate = [
  body("taskName").notEmpty().withMessage("Task name is required"),
  body("dueDate").custom((value) => {
    const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2} (AM|PM)$/;
    if (!regex.test(value)) {
      throw new Error("Valid due date is required (format: MM/DD/YYYY hh:mm AM/PM)");
    }
    return true;
  }),
  handleValidationErrors,
];

export { Registervalidate, LoginValidate, TaskValidate };