import axios from "axios";

const ML_API_URL = process.env.ML_API_URL;

export async function getRiskFromML(consentData) {
  try {
    const response = await axios.post(
      `${ML_API_URL}/predict`,
      consentData,
      { timeout: 5000 }
    );
    return response.data;
  } catch (error) {
    console.error("ML service error:", error.message);
    throw new Error("ML risk scoring failed");
  }
}
