import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar, Download } from 'lucide-react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { mockDB } from '@/react-app/data/mockDatabase';
import { formatCurrency } from '@/react-app/utils/currency';

interface SalesData {
  name: string;
  role: string;
  total_orders: number;
  total_revenue: number;
  today_revenue: number;
}

export default function SalesReports() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const data = await mockDB.getSalesReports();
      setSalesData(data.salesByAdmin);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStats = salesData.reduce((acc, curr) => ({
    totalRevenue: acc.totalRevenue + curr.total_revenue,
    totalOrders: acc.totalOrders + curr.total_orders,
    todayRevenue: acc.todayRevenue + curr.today_revenue
  }), { totalRevenue: 0, totalOrders: 0, todayRevenue: 0 });

  const topPerformer = salesData.length > 0 ? salesData[0] : null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-16 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales Reports</h1>
          <p className="text-slate-600">Track individual admin performance and sales</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalStats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalStats.todayRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Orders</p>
              <p className="text-2xl font-bold text-slate-800">{totalStats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Active Staff</p>
              <p className="text-2xl font-bold text-slate-800">{salesData.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performer Card */}
        {topPerformer && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Top Performer</h3>
                <p className="text-white/80 text-sm">This period</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold">{topPerformer.name}</p>
              <p className="text-white/80 capitalize">{topPerformer.role}</p>
              <div className="flex justify-between items-center pt-2 border-t border-white/20">
                <span className="text-sm">Revenue</span>
                <span className="font-bold">{formatCurrency(topPerformer.total_revenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Orders</span>
                <span className="font-bold">{topPerformer.total_orders}</span>
              </div>
            </div>
          </div>
        )}

        {/* Sales Performance Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Staff Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Staff Member</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Orders</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Total Revenue</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Today</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salesData.map((admin, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {admin.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{admin.name}</p>
                          <p className="text-sm text-slate-600 capitalize">{admin.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-800">{admin.total_orders}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-800">{formatCurrency(admin.total_revenue)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-green-600">{formatCurrency(admin.today_revenue)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Revenue Trends</h2>
        <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">Chart visualization would go here</p>
            <p className="text-sm text-slate-400">Integration with charting library needed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
