import axios from "axios";
import { Consent } from "../models/consent.js";

const ML_URL = `${process.env.ML_API_URL}/predict`;

export const addConsent = async (req, res) => {
  try {
    const data = req.body;

    if (!data.website || !data.permission) {
      return res.status(400).json({ error: "Invalid consent payload" });
    }

    if (data.grantedOn) {
      data.grantedOn = new Date(data.grantedOn);
    }

    const existing = await Consent.findOne({
      website: data.website,
      permission: data.permission,
    });

    let riskUpdate = {};

    try {
      const mlRes = await axios.post(ML_URL, data, { timeout: 5000 });
      riskUpdate = {
        risk_score: mlRes.data.risk_score,
        risk_category: mlRes.data.risk_category,
      };
    } catch {
      console.warn("ML unavailable, preserving existing risk values");
      if (existing?.risk_score !== undefined) {
        riskUpdate = {
          risk_score: existing.risk_score,
          risk_category: existing.risk_category,
        };
      }
    }

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

export const getAllConsents = async (req, res) => {
  try {
    const consents = await Consent.find().sort({ createdAt: -1 });
    res.json(consents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
