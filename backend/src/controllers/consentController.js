import axios from "axios";
import { Consent } from "../models/consent.js";

const ML_BASE_URL = process.env.ML_API_URL; 
// example: https://consent-flow-optimizer-1.onrender.com

/* ================= ADD CONSENT ================= */

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

    /* ================= ML NORMALIZATION ================= */

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

    console.log("Calling ML:", `${ML_BASE_URL}/predict`);
    console.log("ML payload:", mlPayload);

    try {
      const mlRes = await axios.post(
        `${ML_BASE_URL}/predict`,
        mlPayload,
        { timeout: 30000 }
      );

      riskUpdate = {
        risk_score: mlRes.data.risk_score,
        risk_category: mlRes.data.risk_category,
      };
    } catch (err) {
      console.error("ML ERROR:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      // fallback to existing risk if present
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

/* ================= GET ALL CONSENTS ================= */

export const getAllConsents = async (req, res) => {
  try {
    const consents = await Consent.find().sort({ createdAt: -1 });
    res.json(consents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE STATUS ================= */

export const updateConsentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Denied"].includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    const consent = await Consent.findById(id);
    if (!consent) {
      return res.status(404).json({ error: "Consent not found" });
    }

    consent.status = status;
    consent.audit = consent.audit || [];
    consent.audit.push({
      action: `STATUS_SET_${status.toUpperCase()}`,
      source: "dashboard",
      timestamp: new Date(),
    });

    await consent.save();
    res.json(consent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
