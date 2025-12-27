import pandas as pd
import numpy as np
import joblib
import os
import json
from catboost import CatBoostRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

BASE = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE, "new.xlsx")
MODEL_DIR = os.path.join(BASE, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

df = pd.read_excel(DATA_FILE)

df = df.drop(columns=[c for c in ["consentId", "consentString", "riskLevel"] if c in df.columns])

df["grantedOn"] = pd.to_datetime(df["grantedOn"], errors="coerce")

df["granted_year"] = df["grantedOn"].dt.year
df["granted_month"] = df["grantedOn"].dt.month
df["granted_day"] = df["grantedOn"].dt.day
df["granted_hour"] = df["grantedOn"].dt.hour
df["granted_dayOfWeek"] = df["grantedOn"].dt.dayofweek

reference_date = df["grantedOn"].max()
df["days_since_consent"] = (reference_date - df["grantedOn"]).dt.days

df = df.drop(columns=["grantedOn"])

def normalize_risk(v):
    v = float(v)
    if v <= 1.0:
        return v * 10.0
    return v

df["riskScore"] = df["riskScore"].apply(normalize_risk)

TRACKER_WEIGHTS = {
    "Google Analytics": 2.0,
    "Meta Pixel": 3.0,
    "Mixpanel": 2.5,
    "Ad Network": 4.0,
    "Analytics Partner": 1.5
}

def dataflow_score(x):
    if not isinstance(x, str):
        return 0.0
    try:
        arr = json.loads(x)
        if not isinstance(arr, list):
            return 0.0
        s = 0.0
        for i in arr:
            s += TRACKER_WEIGHTS.get(i, 1.0)
        return s
    except:
        return 0.0

df["dataFlow_score"] = df["dataFlow"].apply(dataflow_score)
df = df.drop(columns=["dataFlow"])

def categorize_purpose(p):
    p = str(p).lower()
    if "location" in p:
        return "Location"
    if "camera" in p or "image" in p:
        return "Camera"
    if "audio" in p or "microphone" in p:
        return "Microphone"
    if "track" in p:
        return "Tracking"
    return "General"

df["purpose_cat"] = df["purpose"].apply(categorize_purpose)
df = df.drop(columns=["purpose"])

y = df["riskScore"]
X = df.drop(columns=["riskScore"])

cat_cols = ["website", "platform", "permission", "category", "status", "purpose_cat"]
cat_cols = [c for c in cat_cols if c in X.columns]
cat_feature_indices = [X.columns.get_loc(c) for c in cat_cols]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = CatBoostRegressor(
    iterations=900,
    depth=8,
    learning_rate=0.05,
    loss_function="RMSE",
    l2_leaf_reg=6,
    min_data_in_leaf=40,
    verbose=100,
    cat_features=cat_feature_indices,
    random_seed=42
)

model.fit(X_train, y_train)

train_r2 = model.score(X_train, y_train)
test_r2 = model.score(X_test, y_test)

pred = model.predict(X_test)
mse = mean_squared_error(y_test, pred)
rmse = np.sqrt(mse)

print(f"Train R²: {train_r2:.4f}")
print(f"Test  R²: {test_r2:.4f}")
print(f"Test RMSE: {rmse:.4f}")

model.save_model(os.path.join(MODEL_DIR, "consent_risk_model.cbm"))
joblib.dump(cat_cols, os.path.join(MODEL_DIR, "categorical_columns.pkl"))
joblib.dump(list(X.columns), os.path.join(MODEL_DIR, "feature_order.pkl"))

print("Model and metadata saved successfully.")
