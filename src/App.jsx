import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';

// Intelligence Pages
import AgriMindIntelligence from './pages/Intelligence/AgriMindIntelligence';
import AiAssistantChat from './pages/Intelligence/AiAssistantChat';
import AiAnalysisInsight from './pages/Intelligence/AiAnalysisInsight';

// Market Pages
import MarketDashboard from './pages/Market/MarketDashboard';
import MarketPriceTable from './pages/Market/MarketPriceTable';
import MarketTrendsComparison from './pages/Market/MarketTrendsComparison';
import PricePredictionDashboard from './pages/Market/PricePredictionDashboard';
import PredictionDetails from './pages/Market/PredictionDetails';

// Finance Pages
import ProfitabilityDashboard from './pages/Finance/ProfitabilityDashboard';
import CropProfitabilityComparison from './pages/Finance/CropProfitabilityComparison';
import ExpenseDashboard from './pages/Finance/ExpenseDashboard';
import ExpenseList from './pages/Finance/ExpenseList';
import AddExpense from './pages/Finance/AddExpense';
import ExpenseAnalytics from './pages/Finance/ExpenseAnalytics';
import ExpenseDetails from './pages/Finance/ExpenseDetails';

// Monitoring Pages
import RiskAssessmentDetails from './pages/Monitoring/RiskAssessmentDetails';
import AlertDetails from './pages/Monitoring/AlertDetails';
import NotificationCenter from './pages/Monitoring/NotificationCenter';
import NotificationPreferences from './pages/Monitoring/NotificationPreferences';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ModelManagement from './pages/Admin/ModelManagement';
import UserManagement from './pages/Admin/UserManagement';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Core Intelligence Routes */}
            <Route index element={<AgriMindIntelligence />} />
            <Route path="/intelligence" element={<AgriMindIntelligence />} />
            <Route path="/ai-chat" element={<AiAssistantChat />} />
            <Route path="/ai-insights" element={<AiAnalysisInsight />} />

            {/* Market & Commodity Routes */}
            <Route path="/market" element={<MarketDashboard />} />
            <Route path="/market-prices" element={<MarketPriceTable />} />
            <Route path="/market-trends" element={<MarketTrendsComparison />} />
            <Route path="/price-prediction" element={<PricePredictionDashboard />} />
            <Route path="/prediction-details" element={<PredictionDetails />} />

            {/* Finance & Profitability Routes */}
            <Route path="/profitability" element={<ProfitabilityDashboard />} />
            <Route path="/crop-profitability" element={<CropProfitabilityComparison />} />
            <Route path="/expenses" element={<ExpenseDashboard />} />
            <Route path="/expenses-list" element={<ExpenseList />} />
            <Route path="/expenses-add" element={<AddExpense />} />
            <Route path="/expenses-analytics" element={<ExpenseAnalytics />} />
            <Route path="/expenses-details" element={<ExpenseDetails />} />
            <Route path="/expenses-details/:id" element={<ExpenseDetails />} />

            {/* Monitoring & Risk Routes */}
            <Route path="/risk-assessment" element={<RiskAssessmentDetails />} />
            <Route path="/alerts-detail" element={<AlertDetails />} />
            <Route path="/alerts-detail/:id" element={<AlertDetails />} />
            <Route path="/notifications" element={<NotificationCenter />} />
            <Route path="/notification-preferences" element={<NotificationPreferences />} />

            {/* Admin & System Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/models" element={<ModelManagement />} />
            <Route path="/users" element={<UserManagement />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/intelligence" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
