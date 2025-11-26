import pandas as pd
import numpy as np
import ast

def safe_list(x):
    try:
        return ast.literal_eval(x)
    except:
        return []
    

def preprocess_input(df):
    """
    EXACT preprocessing used during training.
    """

    df = df.copy()

    # Remove columns not used in training
    drop_cols = ["consentId", "consentString"]
    for col in drop_cols:
        if col in df.columns:
            df = df.drop(columns=[col])

    # True datetime columns
    for col in df.select_dtypes(include=["datetime64"]).columns:
        df[f"{col}_year"] = df[col].dt.year
        df[f"{col}_month"] = df[col].dt.month
        df[f"{col}_day"] = df[col].dt.day
        df = df.drop(columns=[col])

    # Try to convert string → datetime
    for col in df.select_dtypes(include=["object"]).columns:
        temp = pd.to_datetime(df[col], errors="coerce")
        if temp.notna().sum() > 0:
            df[f"{col}_year"] = temp.dt.year
            df[f"{col}_month"] = temp.dt.month
            df[f"{col}_day"] = temp.dt.day
            df = df.drop(columns=[col])

    # Convert dataFlow list string → count
    if "dataFlow" in df.columns:
        df["dataFlow"] = df["dataFlow"].apply(
            lambda x: len(safe_list(x)) if isinstance(x, str) else 0
        )

    # Ensure retention months is numeric
    if "retention_months" in df.columns:
        df["retention_months"] = pd.to_numeric(
            df["retention_months"], errors="coerce"
        ).fillna(0)

    return df


def preprocess(raw_df):
    """Alias for compatibility with prediction.py"""
    return preprocess_input(raw_df)
