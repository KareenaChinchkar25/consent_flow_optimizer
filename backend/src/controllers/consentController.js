import axios from "axios";
import { Consent } from "../models/consent.js";

const ML_BASE_URL = process.env.ML_API_URL; // e.g. https://consent-flow-optimizer-1.onrender.com

export const addConsent = async (req, res) => {
  try {
    const data = req.body;

    if (!data.website || !data.permission) {
      return res.status(400).json({ error: "Invalid consent payload" });
    }

    // normalize grantedOn
    if (data.grantedOn) {
      data.grantedOn = new Date(data.grantedOn);
    }

    const existing = await Consent.findOne({
      website: data.website,
      permission: data.permission,
    });

    let riskUpdate = {};

    /* ================= ML NORMALIZATION (KEY FIX) ================= */

    try {
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

      const mlRes = await axios.post(
        `${ML_BASE_URL}/predict`,
        mlPayload,
        { timeout: 5000 }
      );

      riskUpdate = {
        risk_score: mlRes.data.risk_score,
        risk_category: mlRes.data.risk_category,
      };
    } catch (err) {
      console.error(
        "ML ERROR:",
        err.response?.data || err.message
      );

    
      if (existing?.risk_score !== undefined) {
        riskUpdate = {
          risk_score: existing.risk_score,
          risk_category: existing.risk_category,
        };
      }
    }

    /* ================= SAVE CONSENT ================= */

    const consent = await Consent.findOneAndUpdate(
      { website: data.website, permission: data.permission },
      {
        $set: {
          ...data,
          ...riskUpdate,
          lastVerifiedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    res.json(consent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
