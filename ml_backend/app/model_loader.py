import joblib
from catboost import CatBoostRegressor
import os

BASE = os.path.join(os.path.dirname(__file__), "..", "models")

MODEL_FILE = os.path.join(BASE, "consent_risk_model.cbm")
CAT_FILE = os.path.join(BASE, "categorical_columns.pkl")
FEAT_FILE = os.path.join(BASE, "feature_order.pkl")
ENC_PREFIX = os.path.join(BASE, "label_encoder_")

def load_assets():
    # Load CatBoost model
    model = CatBoostRegressor()
    model.load_model(MODEL_FILE)

    # Metadata
    categorical_cols = joblib.load(CAT_FILE)
    feature_order = joblib.load(FEAT_FILE)

    # Load encoders
    encoders = {}
    for col in categorical_cols:
        f = f"{ENC_PREFIX}{col}.pkl"
        encoders[col] = joblib.load(f)

    return model, categorical_cols, feature_order, encoders
