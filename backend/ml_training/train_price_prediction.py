import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import json
from pathlib import Path

def train_price():
    print("Training Price Prediction Regressor...")
    models_dir = Path("app/ml/models")
    models_dir.mkdir(parents=True, exist_ok=True)

    crops = ["wheat", "rice", "maize", "cotton", "sugarcane", "chickpea", "tomato", "potato", "onion", "banana", "mango"]
    le = LabelEncoder()
    le.fit(crops)

    np.random.seed(42)
    n_samples = 500
    data = {
        "crop_enc": np.random.randint(0, len(crops), n_samples),
        "location_enc": np.random.randint(0, 10, n_samples),
        "month_enc": np.random.randint(1, 13, n_samples),
    }

    y = 2000 + data["crop_enc"] * 300 + data["month_enc"] * 25 + np.random.normal(0, 50, n_samples)
    X = pd.DataFrame(data)

    reg = RandomForestRegressor(n_estimators=50, random_state=42)
    reg.fit(X, y)

    joblib.dump(reg, models_dir / "price_prediction.pkl")
    joblib.dump(le, models_dir / "price_crop_encoder.pkl")

    with open(models_dir / "price_prediction_version.json", "w") as f:
        json.dump({"version": "price-rf-1.0.0"}, f)

    print("Price prediction training finished.")

if __name__ == "__main__":
    train_price()
