import { ReactNode } from 'react';
import { Hotel, ShoppingCart, ClipboardList, CreditCard, Users, BarChart3, UserCog, TrendingUp, LogOut } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  adminUser?: any;
  onLogout?: () => void;
}

export default function Layout({ children, activeTab, onTabChange, adminUser, onLogout }: LayoutProps) {
  const baseTabs = [
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const managerTabs = [
    { id: 'sales', label: 'Sales Reports', icon: TrendingUp },
    { id: 'admin', label: 'Admin Users', icon: UserCog },
  ];

  const tabs = adminUser?.role === 'manager' || adminUser?.role === 'admin' || adminUser?.role === 'super-admin' 
    ? [...baseTabs, ...managerTabs]
    : baseTabs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Maria Havens</h1>
                <p className="text-sm text-slate-500">Hotel Point of Sale System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">{adminUser?.name || 'User'}</p>
                <p className="text-xs text-slate-500 capitalize">{adminUser?.role || 'Staff'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {adminUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </div>
                <button
                  onClick={onLogout}
                  className="text-slate-500 hover:text-slate-700 p-1 rounded transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
