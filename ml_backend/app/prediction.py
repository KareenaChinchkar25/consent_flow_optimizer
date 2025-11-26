import pandas as pd
import os
from .preprocessing import preprocess
from .utils import risk_to_category
from .model_loader import load_assets


BASE = os.path.dirname(os.path.dirname(__file__))

DATA_DIR = os.path.join(BASE, "data")
PROCESSED_DIR = os.path.join(BASE, "processed")

DATA_FILE = os.path.join(DATA_DIR, "unseen_data.xlsx")
OUT_FILE = os.path.join(PROCESSED_DIR, "predictions_unseen.csv")


# -----------------------------------------------------------
# ⭐ INTERNAL: Apply preprocessing + encoding + model predict
# -----------------------------------------------------------
def _predict_df(raw_df: pd.DataFrame) -> pd.DataFrame:
    """
    Input:  raw DataFrame (single row or many rows)
    Output: DataFrame with risk_score + risk_category
    """

    # Preprocess same as training
    df = preprocess(raw_df.copy())

    # Load assets
    model, cat_cols, feature_order, encoders = load_assets()

    # Ensure missing cols exist
    for col in feature_order:
        if col not in df.columns:
            df[col] = 0

    # Encode categoricals like training
    for col in cat_cols:
        le = encoders[col]
        mapping = {c: i for i, c in enumerate(le.classes_)}
        unknown_value = len(le.classes_)

        df[col] = [
            mapping[val] if val in mapping else unknown_value
            for val in df[col].astype(str)
        ]

    # Keep same column order
    X = df[feature_order]

    # Predict
    preds = model.predict(X)

    result = raw_df.copy()
    result["risk_score"] = preds
    result["risk_category"] = result["risk_score"].apply(risk_to_category)

    return result


# -----------------------------------------------------------
# ⭐ 1. BATCH prediction (existing behavior)
# -----------------------------------------------------------
def run_prediction():

    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(PROCESSED_DIR, exist_ok=True)

    if not os.path.exists(DATA_FILE):
        raise FileNotFoundError(f"Missing input file: {DATA_FILE}")

    raw_df = pd.read_excel(DATA_FILE)

    output = _predict_df(raw_df)

    output.to_csv(OUT_FILE, index=False)

    return output


# -----------------------------------------------------------
# ⭐ 2. SINGLE input prediction → used by extension
# -----------------------------------------------------------
def predict_single_consent(consent_dict: dict) -> dict:
    """
    Input:  { website: ..., platform: ..., permission: ... }
    Output: { risk_score: float, risk_category: string }
    """

    # Convert dict → DataFrame
    raw_df = pd.DataFrame([consent_dict])

    result = _predict_df(raw_df)

    row = result.iloc[0]

    return {
        "risk_score": float(row["risk_score"]),
        "risk_category": row["risk_category"]
    }
