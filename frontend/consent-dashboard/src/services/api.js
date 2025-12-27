import axios from "axios";
const API_BASE_URL = "https://consent-backend.onrender.com";


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === "ECONNREFUSED") {
      throw new Error("⚠ Node backend offline. Start server!");
    }
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw err;
  }
);

function safeParseList(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val.replace(/'/g, '"'));
  } catch {
    return [];
  }
}


function normalizeConsent(doc) {
 
  const _id = doc._id || doc.id || doc.consentId || null;
  const consentId = doc.consentId || _id;

  return {
   
    _id,
    consentId,

    website: doc.website || "",
    platform: doc.platform || "",
    permission: doc.permission || "",
    category: doc.category || "",
    purpose: doc.purpose || "",
    status: doc.status || "Granted",
    retention_months: Number(doc.retention_months || 0),
    grantedOn: doc.grantedOn,

    dataFlow: safeParseList(doc.dataFlow),

    risk_score: Number(doc.risk_score || 0),
    risk_category: doc.risk_category || "Unknown",
  };
}



export const consentService = {

  async getConsents() {
    const res = await api.get("/consents");
    return res.data.map(normalizeConsent);
  },


  async addConsent(consent) {
    const res = await api.post("/consents", consent);
    return res.data;
  },



 updateConsentStatus: ({ website, permission, status }) =>
  api.patch("/consents/status", {
    website,
    permission,
    status,
  }),
};

export default consentService;
