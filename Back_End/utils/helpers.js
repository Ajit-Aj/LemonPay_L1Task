import { body, validationResult } from 'express-validator';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const parseDueDate = (dueDateString) => {
    try {
        const parsedDate = dayjs.utc(dueDateString, 'MM/DD/YYYY hh:mm A');
        if (!parsedDate.isValid()) {
            return null;
        }
        return parsedDate.toDate();
    } catch (error) {
        return null;
    }
};

// General function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Register validation
const Registervalidate = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    handleValidationErrors,
];

// Login validation
const LoginValidate = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
];

// Task validation
const validateTask = [
    body('taskName').notEmpty().withMessage('Task name is required'),
    body('dueDate').custom((value) => {
        const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2} (AM|PM)$/;
        if (!regex.test(value)) {
            throw new Error('Valid due date is required (format: MM/DD/YYYY hh:mm AM/PM)');
        }
        return true;
    }),
    handleValidationErrors,
];

export { Registervalidate, LoginValidate, validateTask, parseDueDate };
