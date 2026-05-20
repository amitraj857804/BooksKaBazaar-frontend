import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdmin } from '../../context/superadmin/SuperAdminContext';
import {
  LogOut,
  BookOpen,
  ClipboardList,
  Tag,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react';
import EbookManagement from './modules/EbookManagement';
import ExamManagement from './modules/ExamManagement';
import OfferManagement from './modules/OfferManagement';
import BestsellerManagement from './modules/BestsellerManagement';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useSuperAdmin();
  const [activeTab, setActiveTab] = useState('ebook');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/superadmin/login');
  };

  const tabs = [
    {
      id: 'ebook',
      label: 'Ebook Management',
      icon: BookOpen,
      component: EbookManagement,
    },
    {
      id: 'exam',
      label: 'Exam Management',
      icon: ClipboardList,
      component: ExamManagement,
    },
    {
      id: 'offer',
      label: 'Offer Management',
      icon: Tag,
      component: OfferManagement,
    },
    {
      id: 'bestseller',
      label: 'Bestseller Management',
      icon: TrendingUp,
      component: BestsellerManagement,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 lg:transform-none lg:relative lg:z-20 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-amber-500">SuperAdmin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col w-full min-h-screen lg:ml-0">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-slate-200"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 text-center lg:text-right">
              <p className="text-slate-300 text-sm">
                Welcome, <span className="font-semibold text-amber-500">{user?.username}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {/* Tab Content Header */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <p className="text-slate-400 mt-2 text-sm md:text-base">
                Manage and update {activeTab} related content
              </p>
            </div>

            {/* Active Component */}
            {ActiveComponent && <ActiveComponent />}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard;
