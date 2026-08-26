import json
from datetime import datetime
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from app.ml.price_prediction.features import build_features

try:
    from xgboost import XGBRegressor
except ImportError:
    XGBRegressor = None

FEATURES = ["lag_1", "lag_7", "lag_14", "rolling_mean_7", "rolling_mean_14", "rolling_std_7", "month", "week", "day_of_year", "crop", "market", "location"]


def train_price_models(data: pd.DataFrame, output_dir: str):
    frame = build_features(data)
    if len(frame) < 20:
        raise ValueError("At least 20 feature rows are required for training")
    split = max(1, int(len(frame) * 0.2))
    train, test = frame.iloc[:-split], frame.iloc[-split:]
    categorical = ["crop", "market", "location"]
    numeric = [column for column in FEATURES if column not in categorical]
    preprocessor = ColumnTransformer([( "categorical", OneHotEncoder(handle_unknown="ignore"), categorical)], remainder="passthrough")
    candidates = {"linear-regression": LinearRegression(), "random-forest": RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)}
    if XGBRegressor is not None:
        candidates["xgboost"] = XGBRegressor(n_estimators=200, max_depth=4, learning_rate=0.05, objective="reg:squarederror", random_state=42)
    results = {}
    for name, estimator in candidates.items():
        pipeline = Pipeline([( "features", preprocessor), ("model", estimator)])
        pipeline.fit(train[FEATURES], train["price"])
        prediction = pipeline.predict(test[FEATURES])
        actual = test["price"].to_numpy()
        mape = float(np.mean(np.abs((actual - prediction) / actual)) * 100) if np.all(actual != 0) else None
        results[name] = {"mae": float(mean_absolute_error(actual, prediction)), "rmse": float(np.sqrt(mean_squared_error(actual, prediction))), "mape": mape}
    best_name = min(results, key=lambda name: results[name]["rmse"])
    output = Path(output_dir); output.mkdir(parents=True, exist_ok=True)
    # XGBoost is optional at runtime; the sklearn candidates remain reproducible without it.
    best = Pipeline([( "features", preprocessor), ("model", candidates[best_name])])
    best.fit(frame[FEATURES], frame["price"])
    joblib.dump(best, output / "model.joblib")
    metadata = {"model_name": "price-prediction", "version": "v1", "selected_model": best_name, "dataset_size": len(frame), "metrics": results, "training_date": datetime.utcnow().isoformat()}
    (output / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return metadata
