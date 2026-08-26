import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  Spade,
  Leaf,
  Bug,
  Compass,
  TrendingUp,
  DollarSign,
  Store,
  LineChart,
  ShieldCheck,
  Bot,
  Bell,
  ShieldAlert,
  User,
  LogOut,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/farms", label: "Farms & Fields", icon: Spade },
    { to: "/crops", label: "Crops Lifecycle", icon: Leaf },
    { to: "/ml/crop-recommendation", label: "Recommendations", icon: Compass },
    { to: "/ml/disease-detection", label: "Disease Scan", icon: Bug },
    { to: "/ml/yield-prediction", label: "Yield Predictor", icon: TrendingUp },
    { to: "/financial", label: "Financials", icon: DollarSign },
    { to: "/market", label: "Market Intelligence", icon: Store },
    { to: "/ml/price-prediction", label: "Price Forecast", icon: LineChart },
    { to: "/ml/profitability-risk", label: "Profit & Risk", icon: ShieldCheck },
    { to: "/assistant", label: "AI Assistant", icon: Bot },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/profile", label: "Profile", icon: User },
  ];

  if (user?.role === "ADMIN") {
    navItems.push({ to: "/admin", label: "Admin Panel", icon: ShieldAlert });
  }

  return (
    <aside className="w-64 bg-neutral-900 text-neutral-300 flex flex-col border-r border-neutral-800 h-full">
      <div className="h-16 flex items-center px-6 border-b border-neutral-800 flex-shrink-0">
        <h1 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          <Leaf className="text-primary-500" /> AGRIMIND
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary-700 text-white shadow-md shadow-primary-900/30"
                  : "hover:bg-neutral-800 hover:text-white"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-800 flex-shrink-0">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-neutral-800 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
