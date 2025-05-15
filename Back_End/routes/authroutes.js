import express from "express";
import { register, login } from "../controllers/authController.js";
import { Registervalidate, LoginValidate } from "../utils/helpers.js";

const authRouter = express.Router();
authRouter.post("/register", Registervalidate, register);
authRouter.post("/login", LoginValidate, login);

export default authRouter;
