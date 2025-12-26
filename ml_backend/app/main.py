from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

from .schemas import ConsentInput
from .prediction import predict_single_consent
from .utils import validate_input_data

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "ML backend running"}


def normalize_datetime(series):
    """
    Ensures datetime strings become tz-naive timestamps.
    Removes Z or +00:00.
    """
    series = series.astype(str)
    series = series.str.replace("Z", "", regex=False)
    series = series.str.replace("+00:00", "", regex=False)
    return pd.to_datetime(series, errors="coerce")


@app.post("/predict")
def predict_route(consent: ConsentInput):
    """
    Clean, validate, then predict risk score for a single consent.
    """
    try:
        data = consent.dict()

        # Validate required fields
        df = pd.DataFrame([data])
        validate_input_data(df)

        # Normalize datetime
        if "grantedOn" in df.columns:
            df["grantedOn"] = normalize_datetime(df["grantedOn"])
            data["grantedOn"] = str(df["grantedOn"].iloc[0])

        # ML Prediction
        pred = predict_single_consent(data)

        return {
            "risk_score": float(pred["risk_score"]),
            "risk_category": pred["risk_category"]
        }

    except Exception as e:
        print(" ERROR in /predict:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/consents")
def get_consents():
    return []


def get_mock_data():
    return [{
        "consentId": "mock-1",
        "website": "YouTube.com",
        "platform": "Chrome",
        "permission": "Camera",
        "category": "Device Access",
        "purpose": "Video recording",
        "status": "Granted",
        "dataFlow": ["Google Analytics"],
        "retention_months": 12,
        "grantedOn": "2025-01-15 10:20:00",
        "risk_score": 8.2,
        "risk_category": "High",
    }]
