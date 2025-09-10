import { useState, useEffect } from "react";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/react-app/components/Layout";
import POSSystem from "@/react-app/pages/POSSystem";
import OrdersManagement from "@/react-app/pages/OrdersManagement";
import PaymentsManagement from "@/react-app/pages/PaymentsManagement";
import GuestsManagement from "@/react-app/pages/GuestsManagement";
import ReportsManagement from "@/react-app/pages/ReportsManagement";
import AdminManagement from "@/react-app/pages/AdminManagement";
import SalesReports from "@/react-app/pages/SalesReports";

export default function App() {
  const { user, isPending, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pos');

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/login');
    }
  }, [user, isPending, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'pos':
        return <POSSystem />;
      case 'orders':
        return <OrdersManagement />;
      case 'payments':
        return <PaymentsManagement />;
      case 'guests':
        return <GuestsManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'admin':
        return <AdminManagement />;
      case 'sales':
        return <SalesReports />;
      default:
        return <POSSystem />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      adminUser={user}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}
