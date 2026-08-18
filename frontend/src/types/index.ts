export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  role: "FARMER" | "ADMIN";
  is_active: boolean;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

export interface Farm {
  id: string;
  owner_id: string;
  name: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  total_area: number | null;
  soil_type: string | null;
  irrigation_type: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  field_count?: number;
}

export interface Field {
  id: string;
  farm_id: string;
  name: string;
  area: number | null;
  soil_ph: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
  soil_type: string | null;
  irrigation_method: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CropHistoryEntry {
  id: string;
  crop_id: string;
  stage: string;
  notes: string | null;
  created_at: string;
}

export interface Crop {
  id: string;
  field_id: string;
  name: string;
  variety: string | null;
  planting_date: string | null;
  expected_harvest_date: string | null;
  actual_harvest_date: string | null;
  stage: "PLANNING" | "PLANTED" | "GROWING" | "FLOWERING" | "HARVEST_READY" | "HARVESTED" | "SOLD";
  status: "ACTIVE" | "COMPLETED" | "FAILED";
  seed_info: string | null;
  expected_yield: number | null;
  actual_yield: number | null;
  yield_unit: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  history?: CropHistoryEntry[];
}

export interface CropRecommendationItem {
  crop: string;
  probability: number;
  rank: number;
}

export interface CropRecommendationResponse {
  recommendations: CropRecommendationItem[];
  model_version: string;
  prediction_id: string;
}

export interface DiseaseDetectionResponse {
  prediction_id: string;
  predicted_disease: string;
  confidence: number;
  severity: string | null;
  recommendations: string | null;
  model_version: string;
  is_healthy: boolean;
}

export interface YieldPredictionResponse {
  prediction_id: string;
  predicted_yield: number;
  yield_unit: string;
  confidence_lower: number | null;
  confidence_upper: number | null;
  model_version: string;
}

// Module 8 Financial
export interface Expense {
  id: string;
  user_id: string;
  farm_id?: string | null;
  field_id?: string | null;
  crop_id?: string | null;
  title: string;
  category: "SEEDS" | "FERTILIZERS" | "PESTICIDES" | "LABOR" | "MACHINERY" | "IRRIGATION" | "FUEL" | "OTHER";
  amount: number;
  date: string;
  notes?: string | null;
  created_at: string;
}

export interface Revenue {
  id: string;
  user_id: string;
  crop_id?: string | null;
  source: string;
  quantity_sold: number;
  unit_price: number;
  total_amount: number;
  date: string;
  notes?: string | null;
  created_at: string;
}

export interface FinancialSummary {
  total_revenue: number;
  total_expense: number;
  net_profit: number;
  profit_margin_percent: number;
  expense_by_category: Record<string, number>;
  recent_expenses: Expense[];
  recent_revenues: Revenue[];
}

// Module 9 Market Intelligence
export interface MarketPrice {
  id: string;
  crop_name: string;
  market_name: string;
  location: string;
  state?: string | null;
  modal_price: number;
  min_price: number;
  max_price: number;
  unit: string;
  date: string;
  created_at: string;
}

export interface PriceTrendPoint {
  date: string;
  modal_price: number;
  min_price: number;
  max_price: number;
}

// Module 10 Price Prediction
export interface PricePredictionResponse {
  prediction_id: string;
  crop_name: string;
  market_name?: string | null;
  location?: string | null;
  target_month: string;
  predicted_price: number;
  unit: string;
  confidence_lower?: number | null;
  confidence_upper?: number | null;
  trend_direction: string;
  model_version: string;
}

// Module 11 Profitability & Risk Analysis
export interface ProfitabilityRiskResponse {
  analysis_id: string;
  crop_name: string;
  estimated_cost: number;
  projected_revenue: number;
  projected_profit: number;
  expected_roi_percent: number;
  overall_risk_score: "LOW" | "MEDIUM" | "HIGH";
  disease_risk_factor: number;
  market_price_volatility: number;
  weather_risk_factor: number;
  risk_breakdown: Record<string, any>;
  recommendations: string;
  model_version: string;
}

// Module 12 AI Assistant
export interface ChatMessage {
  id: string;
  session_id: string;
  sender: "USER" | "ASSISTANT";
  content: string;
  created_at: string;
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  history: ChatMessage[];
}

// Module 13 Notifications
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "DISEASE_ALERT" | "HARVEST_REMINDER" | "PRICE_ALERT" | "SYSTEM_TIP" | "FINANCIAL_ALERT";
  is_read: boolean;
  link?: string | null;
  created_at: string;
}

// Module 14 Admin
export interface MLModelStatus {
  name: string;
  version: string;
  status: string;
  last_trained?: string | null;
}

export interface AdminOverview {
  total_users: number;
  total_farmers: number;
  total_farms: number;
  total_fields: number;
  total_crops: number;
  total_predictions: number;
  system_health: string;
  ml_models: MLModelStatus[];
}
