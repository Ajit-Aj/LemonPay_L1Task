import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRouter from "./routes/authroutes.js";
import taskRouter from "./routes/taskroutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
const authroutes = authRouter;
const taskRoutes = taskRouter;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
    res.status(200).send("Secure server is running!");
});

app.use("/api/users", authroutes);
app.use("/api/tasks", taskRoutes);


app.listen(PORT, () => {
    console.log(`Server running securely on port ${PORT}`);
});
