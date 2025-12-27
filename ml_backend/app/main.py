from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from schemas import ConsentInput
from prediction import predict_single_consent
from utils import validate_input_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "ML backend running"}

def normalize_datetime(series):
    series = series.astype(str)
    series = series.str.replace("Z", "", regex=False)
    series = series.str.replace("+00:00", "", regex=False)
    return pd.to_datetime(series, errors="coerce")

@app.post("/predict")
def predict_route(consent: ConsentInput):
    try:
        data = consent.dict()

        df = pd.DataFrame([data])
        validate_input_data(df)

        if "grantedOn" in df.columns:
            df["grantedOn"] = normalize_datetime(df["grantedOn"])
            data["grantedOn"] = str(df["grantedOn"].iloc[0])

        pred = predict_single_consent(data)

        return {
            "risk_score": float(pred["risk_score"]),
            "risk_category": pred["risk_category"]
        }

    except Exception as e:
        print("ERROR in /predict:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok"}
