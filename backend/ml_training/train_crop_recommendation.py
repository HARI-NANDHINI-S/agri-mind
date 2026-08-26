import os
import sys
import argparse
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json

def train_recommendation():
    print("Training Crop Recommendation Model...")
    models_dir = Path("app/ml/models")
    models_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. Create Synthetic / Mock Dataset if not provided
    # Standard columns: N, P, K, temperature, humidity, ph, rainfall, label
    np.random.seed(42)
    n_samples = 1000
    
    crops = ["rice", "maize", "chickpea", "cotton", "banana", "mango", "grapes"]
    
    data = {
        "N": np.random.uniform(10, 100, n_samples),
        "P": np.random.uniform(10, 100, n_samples),
        "K": np.random.uniform(10, 100, n_samples),
        "temperature": np.random.uniform(15, 38, n_samples),
        "humidity": np.random.uniform(30, 95, n_samples),
        "ph": np.random.uniform(4.5, 8.5, n_samples),
        "rainfall": np.random.uniform(50, 300, n_samples),
        "label": np.random.choice(crops, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    X = df.drop(columns=["label"])
    y = df["label"]
    
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
    
    clf = RandomForestClassifier(n_estimators=50, random_state=42)
    clf.fit(X_train, y_train)
    
    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"RandomForest Accuracy: {acc:.4f}")
    
    # Save artifacts
    joblib.dump(clf, models_dir / "crop_recommendation.pkl")
    joblib.dump(le, models_dir / "crop_label_encoder.pkl")
    
    # Save version manifest
    with open(models_dir / "crop_recommendation_version.json", "w") as f:
        json.dump({"version": "rf-1.0.0", "accuracy": float(acc)}, f)
        
    print("Crop recommendation training finished.")

if __name__ == "__main__":
    from pathlib import Path
    train_recommendation()
