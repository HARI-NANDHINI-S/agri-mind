import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import CommandPalette from '../common/CommandPalette';
import Toast from '../common/Toast';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Toast notifications */}
      <Toast />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      <div className="flex flex-1 min-h-screen overflow-hidden">
        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Persistent Desktop / Drawer Mobile Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
          
          <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto animate-fade-in pb-16">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
