import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import consentRoutes from "./routes/consent.routes.js";

dotenv.config();

const app = express();

// ✅ allow all origins (safe for now)
app.use(cors());

app.use(express.json());

// Connect to MongoDB
connectDB();

// test route
app.get("/", (req, res) => {
  res.json({ message: "Node.js backend running with MongoDB" });
});

// routes
app.use("/consents", consentRoutes);

// Render-compatible port
const PORT = process.env.PORT || 10000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
