import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import json
from pathlib import Path

def train_yield():
    print("Training Yield Prediction Regressor...")
    models_dir = Path("app/ml/models")
    models_dir.mkdir(parents=True, exist_ok=True)
    
    n_samples = 1000
    crops = ["rice", "wheat", "maize", "sugarcane", "cotton", "jute", "coffee", "coconut", "mango", "banana", "grapes", "apple", "chickpea", "lentil", "mungbean"]
    
    le = LabelEncoder()
    le.fit(crops)
    
    # synthetic columns: crop_enc, area, nitrogen, phosphorus, potassium, rainfall, temp, hum, season_enc
    np.random.seed(42)
    data = {
        "crop_enc": np.random.randint(0, len(crops), n_samples),
        "area": np.random.uniform(1, 50, n_samples),
        "nitrogen": np.random.uniform(10, 100, n_samples),
        "phosphorus": np.random.uniform(10, 100, n_samples),
        "potassium": np.random.uniform(10, 100, n_samples),
        "rainfall": np.random.uniform(50, 300, n_samples),
        "temp": np.random.uniform(15, 38, n_samples),
        "hum": np.random.uniform(30, 95, n_samples),
        "season_enc": np.random.randint(0, 4, n_samples),
    }
    
    # target: predicted yield in tonnes/ha
    # simple mathematical mapping to give features some correlation
    y = 2.5 + data["nitrogen"] * 0.02 + data["rainfall"] * 0.005 + np.random.normal(0, 0.5, n_samples)
    
    X = pd.DataFrame(data)
    
    reg = RandomForestRegressor(n_estimators=50, random_state=42)
    reg.fit(X, y)
    
    joblib.dump(reg, models_dir / "yield_prediction.pkl")
    joblib.dump(le, models_dir / "yield_crop_encoder.pkl")
    
    with open(models_dir / "yield_prediction_version.json", "w") as f:
        json.dump({"version": "y-rf-1.0.0"}, f)
        
    print("Yield prediction training finished.")

if __name__ == "__main__":
    train_yield()
