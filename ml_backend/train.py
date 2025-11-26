import pandas as pd
import numpy as np
import joblib
import os
from catboost import CatBoostRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import json

# Paths
BASE = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE, "consent_dataset_10000.xlsx")
MODEL_DIR = os.path.join(BASE, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

# Load dataset
df = pd.read_excel(DATA_FILE)

drop_cols = ["consentId", "consentString", "riskLevel"]
df = df.drop(columns=[c for c in drop_cols if c in df.columns])


df["grantedOn"] = pd.to_datetime(df["grantedOn"], errors="coerce")
df["grantedOn_year"] = df["grantedOn"].dt.year
df["grantedOn_month"] = df["grantedOn"].dt.month
df["grantedOn_day"] = df["grantedOn"].dt.day
df = df.drop(columns=["grantedOn"])


def parse_list(x):
    try:
        lst = json.loads(x) if isinstance(x, str) else []
        return len(lst)
    except:
        return 0

df["dataFlow"] = df["dataFlow"].apply(parse_list)


y = df["riskScore"]
X = df.drop(columns=["riskScore"])


cat_cols = ["website", "platform", "permission", "category", "purpose", "status"]
cat_cols = [c for c in cat_cols if c in X.columns]

for col in cat_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))
    joblib.dump(le, os.path.join(MODEL_DIR, f"label_encoder_{col}.pkl"))

# Encode any leftover strings
for col in X.select_dtypes(include=["object"]).columns:
    X[col] = LabelEncoder().fit_transform(X[col])


# Train-test split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

cat_idx = [X_train.columns.get_loc(c) for c in cat_cols]


# Train CatBoost

model = CatBoostRegressor(
    iterations=500,
    depth=7,
    learning_rate=0.06,
    loss_function="RMSE",
    verbose=False
)

model.fit(X_train, y_train, cat_features=cat_idx)

print("Train R²:", model.score(X_train, y_train))
print("Test  R²:", model.score(X_test, y_test))


# Save model + metadata

model.save_model(os.path.join(MODEL_DIR, "consent_risk_model.cbm"))
joblib.dump(cat_cols, os.path.join(MODEL_DIR, "categorical_columns.pkl"))
joblib.dump(list(X.columns), os.path.join(MODEL_DIR, "feature_order.pkl"))

print("\nModel & metadata saved successfully.")
