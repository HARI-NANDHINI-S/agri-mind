import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/useAuth";
import { ToastProvider } from "./hooks/useToast";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import FarmerDashboard from "./pages/Dashboard/FarmerDashboard";
import FarmList from "./pages/Farms/FarmList";
import CropList from "./pages/Crops/CropList";
import CropRecommendation from "./pages/ML/CropRecommendation";
import DiseaseDetection from "./pages/ML/DiseaseDetection";
import YieldPrediction from "./pages/ML/YieldPrediction";
import FinancialManagement from "./pages/Financial/FinancialManagement";
import MarketIntelligence from "./pages/Market/MarketIntelligence";
import PricePrediction from "./pages/ML/PricePrediction";
import ProfitabilityRisk from "./pages/ML/ProfitabilityRisk";
import AIAssistant from "./pages/Assistant/AIAssistant";
import Notifications from "./pages/Notifications/Notifications";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Profile from "./pages/Profile/Profile";

// Layout
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Layout from "./components/layout/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/dashboard"
                  element={
                    <Layout>
                      <FarmerDashboard />
                    </Layout>
                  }
                />
                <Route
                  path="/farms"
                  element={
                    <Layout>
                      <FarmList />
                    </Layout>
                  }
                />
                <Route
                  path="/crops"
                  element={
                    <Layout>
                      <CropList />
                    </Layout>
                  }
                />
                <Route
                  path="/ml/crop-recommendation"
                  element={
                    <Layout>
                      <CropRecommendation />
                    </Layout>
                  }
                />
                <Route
                  path="/ml/disease-detection"
                  element={
                    <Layout>
                      <DiseaseDetection />
                    </Layout>
                  }
                />
                <Route
                  path="/ml/yield-prediction"
                  element={
                    <Layout>
                      <YieldPrediction />
                    </Layout>
                  }
                />
                <Route
                  path="/financial"
                  element={
                    <Layout>
                      <FinancialManagement />
                    </Layout>
                  }
                />
                <Route
                  path="/market"
                  element={
                    <Layout>
                      <MarketIntelligence />
                    </Layout>
                  }
                />
                <Route
                  path="/ml/price-prediction"
                  element={
                    <Layout>
                      <PricePrediction />
                    </Layout>
                  }
                />
                <Route
                  path="/ml/profitability-risk"
                  element={
                    <Layout>
                      <ProfitabilityRisk />
                    </Layout>
                  }
                />
                <Route
                  path="/assistant"
                  element={
                    <Layout>
                      <AIAssistant />
                    </Layout>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <Layout>
                      <Notifications />
                    </Layout>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Layout>
                      <Profile />
                    </Layout>
                  }
                />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
