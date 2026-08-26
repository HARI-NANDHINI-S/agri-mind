import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const initialExpenses = [
  {
    id: 'EXP-8842',
    category: 'Fertilizer & Soil',
    item: 'NPK 20-20-20 (50 Bags)',
    amount: 2450.00,
    field: 'Field 4B - North Sector',
    date: '2026-08-14',
    vendor: 'AgroChem Solutions Ltd',
    status: 'Approved',
    paymentMethod: 'Bank Transfer',
    receipt: 'receipt_8842.pdf',
    notes: 'Pre-monsoon soil enrichment batch for Wheat crop.',
    tax: 122.50,
    recordedBy: 'Rajesh Kumar (Field Agronomist)'
  },
  {
    id: 'EXP-8841',
    category: 'Fuel & Machinery',
    item: 'Diesel for John Deere Tractor (200L)',
    amount: 720.00,
    field: 'All Fields (Central Hub)',
    date: '2026-08-12',
    vendor: 'Bharat Petroleum',
    status: 'Approved',
    paymentMethod: 'Corporate Card',
    receipt: 'diesel_slip_0812.pdf',
    notes: 'Tillage and deep plowing cycle fuel consumption.',
    tax: 36.00,
    recordedBy: 'Aarav Patel (Farm Manager)'
  },
  {
    id: 'EXP-8840',
    category: 'Seeds & Propagation',
    item: 'Hybrid Maize Seed Packets (20kg)',
    amount: 1180.00,
    field: 'Field 2A - South Ridge',
    date: '2026-08-10',
    vendor: 'National Seed Corporation',
    status: 'Approved',
    paymentMethod: 'UPI / Direct',
    receipt: 'seed_cert_1180.pdf',
    notes: 'High-yield drought-tolerant certified seed lot #490.',
    tax: 59.00,
    recordedBy: 'Rajesh Kumar'
  },
  {
    id: 'EXP-8839',
    category: 'Irrigation & Water',
    item: 'Drip Line Replacement Valves & Emitters',
    amount: 480.00,
    field: 'Field 1C - Orchard Block',
    date: '2026-08-08',
    vendor: 'Jain Irrigation Systems',
    status: 'Pending',
    paymentMethod: 'Vendor Credit',
    receipt: 'drip_invoice_480.pdf',
    notes: 'Replaced clogged drip emitters before scheduled fertigation.',
    tax: 24.00,
    recordedBy: 'Sunil Verma'
  },
  {
    id: 'EXP-8838',
    category: 'Labor & Contracting',
    item: 'Seasonal Weeding Crew (8 workers x 3 days)',
    amount: 1440.00,
    field: 'Field 4B - North Sector',
    date: '2026-08-05',
    vendor: 'Kisan Labor Cooperative',
    status: 'Approved',
    paymentMethod: 'Direct Transfer',
    receipt: 'labor_muster_8838.pdf',
    notes: 'Manual inter-row weed clearance prior to herbicide spray.',
    tax: 0.00,
    recordedBy: 'Aarav Patel'
  },
  {
    id: 'EXP-8837',
    category: 'Pesticides & Crop Health',
    item: 'Bio-Fungicide Trichoderma (10kg)',
    amount: 360.00,
    field: 'Field 3A - Pulse Plot',
    date: '2026-08-02',
    vendor: 'BioCare Agro Supplies',
    status: 'Approved',
    paymentMethod: 'Bank Transfer',
    receipt: 'biocare_360.pdf',
    notes: 'Preventive soil drenching for root rot control.',
    tax: 18.00,
    recordedBy: 'Rajesh Kumar'
  }
];

export const initialNotifications = [
  {
    id: 'NOTIF-01',
    type: 'alert',
    severity: 'critical',
    title: 'Yellow Rust Warning - High Humidity Risk',
    message: 'Satellite NDVI & humidity sensors detect spore germination window in Field 4B. Immediate preventive spraying recommended within 48h.',
    time: '15 mins ago',
    date: '2026-08-16 20:45',
    read: false,
    link: '/alerts-detail/rust-field-4b',
    category: 'Crop Health'
  },
  {
    id: 'NOTIF-02',
    type: 'market',
    severity: 'info',
    title: 'Wheat Mandi Price Surge (+4.8%)',
    message: 'Indore Mandi wheat spot price reached ₹2,640/quintal due to export quota announcements. Consider liquidating stored surplus.',
    time: '2 hours ago',
    date: '2026-08-16 19:10',
    read: false,
    link: '/market',
    category: 'Market Trends'
  },
  {
    id: 'NOTIF-03',
    type: 'ai',
    severity: 'success',
    title: 'Yield Prediction Model v3.4 Retrained',
    message: 'Model convergence achieved with 94.2% historical accuracy (+1.8% over v3.3). Updated harvest projections ready in intelligence suite.',
    time: '5 hours ago',
    date: '2026-08-16 16:20',
    read: true,
    link: '/prediction-details',
    category: 'AI Pipeline'
  },
  {
    id: 'NOTIF-04',
    type: 'expense',
    severity: 'warning',
    title: 'Monthly Fertilizer Budget 82% Utilized',
    message: 'Current spend ₹14,250 of ₹17,500 monthly allocation. Review remaining scheduled purchases for August.',
    time: 'Yesterday',
    date: '2026-08-15 11:30',
    read: true,
    link: '/expenses-analytics',
    category: 'Finance'
  }
];

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('agrimind_theme') || 'light';
  });

  const [activeFarm, setActiveFarm] = useState({
    id: 'farm-01',
    name: 'Green Acres Agri-Hub',
    location: 'Indore, Madhya Pradesh',
    currentField: 'Field 4B (Wheat - 45 Acres)',
    totalArea: '185 Acres',
    season: 'Kharif / Rabi Transition 2026'
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('agrimind_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('agrimind_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello Aarav! I am your AgriMind Agronomy Copilot. I'm actively monitoring your 185 acres across soil moisture, micro-weather, satellite NDVI, and local mandi prices. How can I assist your farming operations today?",
      time: '10:00 AM',
      context: 'Field 4B - Wheat'
    },
    {
      id: 2,
      sender: 'user',
      text: "What's the optimal nitrogen top-dressing timing for Field 4B given this weekend's rainfall forecast?",
      time: '10:02 AM'
    },
    {
      id: 3,
      sender: 'ai',
      text: "Based on IMD high-resolution radar predicting 18-22mm light showers on Sunday evening (Aug 18), I recommend applying Urea (45 kg/acre) on Saturday afternoon. The subsequent gentle precipitation will facilitate root zone absorption with less than 3% volatilization risk.",
      time: '10:02 AM',
      actionable: true,
      suggestions: [
        'Log Urea expense now',
        'Check Yellow Rust risk post-rain',
        'Simulate yield impact'
      ]
    }
  ]);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('agrimind_theme', theme);
  }, [theme]);

  // Sync expenses
  useEffect(() => {
    localStorage.setItem('agrimind_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Sync notifications
  useEffect(() => {
    localStorage.setItem('agrimind_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addExpense = (newExp) => {
    const record = {
      ...newExp,
      id: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: newExp.status || 'Approved',
      date: newExp.date || new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [record, ...prev]);
    showToast(`Expense "${record.item}" logged successfully!`, 'success');
    return record;
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Expense deleted', 'info');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const sendChatMessage = (text, customContext = null) => {
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);

    // Intelligent automated AI response
    setTimeout(() => {
      let aiReply = "AgriMind AI analyzed your query with respect to current field sensor telemetry and soil nitrogen levels. Recommendations have been calibrated.";
      const lower = text.toLowerCase();
      if (lower.includes('wheat') || lower.includes('price') || lower.includes('sell')) {
        aiReply = "Market Analysis: Wheat futures at Indore Mandi show strong upward momentum (+4.8% this week). Our LSTM model forecasts a peak around ₹2,680/qtl in late August. Holding 30% surplus until next week is projected to yield an additional ₹85/qtl margin.";
      } else if (lower.includes('rust') || lower.includes('disease') || lower.includes('fungus')) {
        aiReply = "Pathology Insight: Early foliar analysis shows moderate risk of Puccinia striiformis (Yellow Rust). Recommended protocol: Propiconazole 25% EC @ 1ml/L water within 48 hours before canopy closure.";
      } else if (lower.includes('cost') || lower.includes('profit') || lower.includes('expense')) {
        aiReply = "Financial Diagnostic: Your current operating cost per acre for Wheat is ₹18,450 vs benchmark ₹19,200 (4.1% cost advantage). Fertilizer makes up 41% of total input burn.";
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionable: true,
        context: customContext || activeFarm.currentField
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 700);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeFarm,
        setActiveFarm,
        expenses,
        addExpense,
        deleteExpense,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        unreadCount,
        chatMessages,
        sendChatMessage,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        showToast,
        toastMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
