import pandas as pd

REQUIRED_COLUMNS = {"date", "crop", "market", "location", "price"}


def build_features(data: pd.DataFrame) -> pd.DataFrame:
    missing = REQUIRED_COLUMNS - set(data.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")
    frame = data.copy()
    frame["date"] = pd.to_datetime(frame["date"], errors="raise")
    frame = frame.sort_values(["crop", "market", "location", "date"])
    grouped = frame.groupby(["crop", "market", "location"], group_keys=False)
    frame["lag_1"] = grouped["price"].shift(1)
    frame["lag_7"] = grouped["price"].shift(7)
    frame["lag_14"] = grouped["price"].shift(14)
    frame["rolling_mean_7"] = grouped["price"].transform(lambda values: values.shift(1).rolling(7).mean())
    frame["rolling_mean_14"] = grouped["price"].transform(lambda values: values.shift(1).rolling(14).mean())
    frame["rolling_std_7"] = grouped["price"].transform(lambda values: values.shift(1).rolling(7).std())
    frame["month"] = frame["date"].dt.month
    frame["week"] = frame["date"].dt.isocalendar().week.astype(int)
    frame["day_of_year"] = frame["date"].dt.dayofyear
    return frame.dropna().reset_index(drop=True)
