import axios from "axios";
import { Consent } from "../models/consent.js";

const ML_BASE_URL = process.env.ML_API_URL;

export const addConsent = async (req, res) => {
  try {
    const data = req.body;

    if (!data.website || !data.permission) {
      return res.status(400).json({ error: "Invalid consent payload" });
    }

    if (data.grantedOn) {
      data.grantedOn = new Date(data.grantedOn);
    }

    const consent = await Consent.findOneAndUpdate(
      { website: data.website, permission: data.permission },
      {
        $set: {
          ...data,
          lastVerifiedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    const mlPayload = {
      website: data.website,
      platform: data.platform || "Chrome",
      permission: data.permission.toLowerCase(),
      category: data.category || "Device Access",
      purpose:
        data.purpose === "Permission state changed"
          ? "Device access"
          : data.purpose,
      retention_months: Number(data.retention_months || 12),
      dataFlow: Array.isArray(data.dataFlow) ? data.dataFlow : [],
      grantedOn: data.grantedOn
        ? data.grantedOn.toISOString()
        : new Date().toISOString(),
    };

    (async () => {
      try {
        const mlRes = await axios.post(
          `${ML_BASE_URL}/predict`,
          mlPayload,
          { timeout: 30000 }
        );

        await Consent.findByIdAndUpdate(consent._id, {
          risk_score: mlRes.data.risk_score,
          risk_category: mlRes.data.risk_category,
        });
      } catch (e) {
        console.error("ML async failed:", e.message);
      }
    })();

    res.json(consent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllConsents = async (req, res) => {
  try {
    const consents = await Consent.find().sort({ createdAt: -1 });
    res.json(consents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
