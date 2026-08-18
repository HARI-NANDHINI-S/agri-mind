import joblib
import json
from pathlib import Path

def train_disease():
    print("Writing mock metadata for Disease Detection model...")
    models_dir = Path("app/ml/models")
    models_dir.mkdir(parents=True, exist_ok=True)
    
    classes = ["healthy", "early_blight", "late_blight", "leaf_mold", "bacterial_spot", "mosaic_virus"]
    joblib.dump(classes, models_dir / "disease_classes.pkl")
    
    # Save a JSON file indicating we are running in lightweight/stub mode
    with open(models_dir / "disease_detection_version.json", "w") as f:
        json.dump({"version": "stub-1.0.0", "classes": classes}, f)
        
    print("Mock metadata written successfully.")

if __name__ == "__main__":
    train_disease()
