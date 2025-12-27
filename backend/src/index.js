import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import consentRoutes from "./routes/consent.routes.js";

dotenv.config();

const app = express();

// middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

// Connect to MongoDB
connectDB();

// test route
app.get("/", (req, res) => {
  res.json({ message: "Node.js backend running with MongoDB" });
});

// routes
app.use("/consents", consentRoutes);

// IMPORTANT: Render-compatible port
const PORT = process.env.PORT || 10000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
