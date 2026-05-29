import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

const configuredClientOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredClientOrigins,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Task Manager API",
    status: "ok",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me"
      },
      tasks: {
        list: "GET /api/tasks",
        create: "POST /api/tasks",
        update: "PUT /api/tasks/:id",
        delete: "DELETE /api/tasks/:id"
      }
    }
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
