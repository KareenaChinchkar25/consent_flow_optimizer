import express from "express";
import {
  getSettings,
  saveSettings
} from "../controllers/settings.controller.js";

// import authMiddleware from "../middleware/auth.js"; // optional

const router = express.Router();

// router.use(authMiddleware); // enable later

router.get("/", getSettings);
router.post("/", saveSettings);

export default router;
