from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from .schemas import ConsentInput
from .prediction import predict_single_consent


app = FastAPI()

# ---------------------------------------------------------
# CORS MUST BE THE FIRST THING ADDED
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # allow ALL origins (for dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# PATHS (FIXED & SAFE)
# ---------------------------------------------------------
BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
DATA_DIR = os.path.abspath(os.path.join(BASE, "data"))
PROCESSED_DIR = os.path.abspath(os.path.join(BASE, "processed"))


UNSEEN_FILE = os.path.join(DATA_DIR, "unseen_consents.xlsx")
PRED_FILE = os.path.join(PROCESSED_DIR, "predictions_unseen.csv")

# Ensure folders exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "ML backend running"}


# ---------------------------------------------------------
# ⭐ ADD CONSENT
# ---------------------------------------------------------
@app.post("/add-consent")
def add_consent(consent: ConsentInput):
    try:
        print("➡️ Incoming consent:", consent.dict())   # DEBUG 1

        df = pd.DataFrame([consent.dict()])

        # Save unseen
        if os.path.exists(UNSEEN_FILE):
            old = pd.read_excel(UNSEEN_FILE)
            df = pd.concat([old, df], ignore_index=True)

        df.to_excel(UNSEEN_FILE, index=False)

        print("📁 Saved to unseen file")   # DEBUG 2


        # --- ML prediction ---
        pred = predict_single_consent(consent.dict())
        print("🤖 Prediction output:", pred)  # DEBUG 3


        # Build output row
        pred_row = pd.DataFrame([{
            **consent.dict(),
            "risk_score": pred["risk_score"],
            "risk_category": pred["risk_category"]
        }])

        # Append to predictions file
        if os.path.exists(PRED_FILE):
            prev = pd.read_csv(PRED_FILE)
            pred_row = pd.concat([prev, pred_row], ignore_index=True)

        pred_row.to_csv(PRED_FILE, index=False)
        print("✅ Wrote to predictions_unseen.csv")   # DEBUG 4

        return {"message": "Consent received", "prediction": pred}

    except Exception as e:
        print("❌ ERROR IN /add-consent:", type(e), str(e))   # DEBUG 5
        raise HTTPException(status_code=500, detail=str(e))


        if os.path.exists(PRED_FILE):
            prev = pd.read_csv(PRED_FILE)
            pred_row = pd.concat([prev, pred_row], ignore_index=True)

        pred_row.to_csv(PRED_FILE, index=False)

        return {"message": "Consent received", "prediction": pred}

    except Exception as e:
        print("ERROR IN /add-consent:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------
# ⭐ GET PREDICTIONS FOR DASHBOARD
# ---------------------------------------------------------
@app.get("/consents")
def get_consents():
    try:
        if not os.path.exists(PRED_FILE):
            return get_mock_data()   # return ARRAY not object

        df = pd.read_csv(PRED_FILE)

        if df.empty:
            return get_mock_data()

        df = df.fillna({
            "risk_score": 0.0,
            "risk_category": "Unknown",
            "website": "",
            "platform": "",
            "permission": "",
            "category": "",
            "purpose": "",
            "status": "",
            "dataFlow": "[]",
            "retention_months": 0,
            "grantedOn": ""
        })

        df["risk_score"] = df["risk_score"].astype(float)

        return df.to_dict(orient="records")    # ← FIXED

    except Exception as e:
        print("🔥 ERROR IN /consents:", e)
        return get_mock_data()

# ---------------------------------------------------------
# MOCK DATA FALLBACK
# ---------------------------------------------------------
def get_mock_data():
    return [
        {
            "consentId": "mock-1",
            "website": "YouTube.com",
            "platform": "Chrome",
            "permission": "Camera",
            "category": "Device Access",
            "purpose": "Video recording",
            "status": "Granted",
            "dataFlow": ["Google Analytics"],
            "retention_months": 12,
            "grantedOn": "2025-01-15T10:20:00",
            "risk_score": 0.82,
            "risk_category": "High",
        }
    ]
