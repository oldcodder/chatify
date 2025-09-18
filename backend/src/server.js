import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDb } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// 👉 Middlewares
app.use(express.json());

// 👉 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// 👉 Serve React build in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "../frontend","dist","index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);    
  connectDb();
});
