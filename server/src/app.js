import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import publicRoutes from "./routes/public.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

const app = express();
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ragify-node-api",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/public/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
