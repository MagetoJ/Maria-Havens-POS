import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Calendar, Download } from 'lucide-react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { mockDB } from '@/react-app/data/mockDatabase';
import { formatCurrency } from '@/react-app/utils/currency';

export default function ReportsManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersData = await mockDB.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return orderDate === today;
  }).length;

  // Orders by type
  const ordersByType = {
    'room-service': orders.filter(o => o.type === 'room-service').length,
    'restaurant': orders.filter(o => o.type === 'restaurant').length,
    'bar': orders.filter(o => o.type === 'bar').length
  };

  // Revenue by type
  const revenueByType = {
    'room-service': orders.filter(o => o.type === 'room-service' && o.status === 'paid').reduce((sum, order) => sum + order.total, 0),
    'restaurant': orders.filter(o => o.type === 'restaurant' && o.status === 'paid').reduce((sum, order) => sum + order.total, 0),
    'bar': orders.filter(o => o.type === 'bar' && o.status === 'paid').reduce((sum, order) => sum + order.total, 0)
  };

  // Average order value
  const paidOrders = orders.filter(o => o.status === 'paid');
  const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  // Peak hours analysis
  const ordersByHour = orders.reduce((acc, order) => {
    const hour = new Date(order.createdAt).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const peakHour = Object.entries(ordersByHour).reduce((peak, [hour, count]) => 
    (count as number) > peak.count ? { hour: parseInt(hour), count: count as number } : peak
  , { hour: 0, count: 0 });

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
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-slate-600">Comprehensive business insights and performance metrics</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Orders</p>
              <p className="text-2xl font-bold text-slate-800">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(averageOrderValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Today's Orders</p>
              <p className="text-2xl font-bold text-slate-800">{todayOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Type */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Orders by Service Type</h2>
          <div className="space-y-4">
            {Object.entries(ordersByType).map(([type, count]) => {
              const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
              const typeColors = {
                'room-service': 'bg-blue-500',
                'restaurant': 'bg-green-500',
                'bar': 'bg-purple-500'
              };
              
              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {type.replace('-', ' ')}
                    </span>
                    <span className="text-sm text-slate-600">
                      {count} orders ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${typeColors[type as keyof typeof typeColors]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Type */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Revenue by Service Type</h2>
          <div className="space-y-4">
            {Object.entries(revenueByType).map(([type, revenue]) => {
              const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
              const typeColors = {
                'room-service': 'bg-blue-500',
                'restaurant': 'bg-green-500',
                'bar': 'bg-purple-500'
              };
              
              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {type.replace('-', ' ')}
                    </span>
                    <span className="text-sm text-slate-600">
                      {formatCurrency(revenue)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${typeColors[type as keyof typeof typeColors]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Peak Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Peak Activity</h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="bg-yellow-500 p-2 rounded-full">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Peak Hour</p>
                  <p className="text-lg font-bold text-yellow-900">
                    {peakHour.hour}:00 - {peakHour.hour + 1}:00
                  </p>
                  <p className="text-xs text-yellow-700">
                    {peakHour.count} orders
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Activity Distribution</p>
              {Object.entries(ordersByHour)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .slice(0, 5)
                .map(([hour, count]) => (
                  <div key={hour} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">
                      {parseInt(hour)}:00
                    </span>
                    <span className="font-medium text-slate-800">
                      {count as number} orders
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Status</h2>
          <div className="space-y-3">
            {['pending', 'preparing', 'ready', 'delivered', 'paid'].map((status) => {
              const count = orders.filter(o => o.status === status).length;
              const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
              const statusColors = {
                pending: 'bg-yellow-500',
                preparing: 'bg-blue-500',
                ready: 'bg-green-500',
                delivered: 'bg-purple-500',
                paid: 'bg-gray-500'
              };
              
              return (
                <div key={status} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-800">{count}</span>
                    <span className="text-xs text-slate-500 ml-1">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Insights</h2>
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <p className="text-sm text-slate-600">Pending Orders</p>
              <p className="text-xl font-bold text-orange-600">{pendingOrders}</p>
            </div>
            
            <div className="border-b border-slate-200 pb-3">
              <p className="text-sm text-slate-600">Completion Rate</p>
              <p className="text-xl font-bold text-green-600">
                {totalOrders > 0 ? ((orders.filter(o => o.status === 'paid').length / totalOrders) * 100).toFixed(1) : 0}%
              </p>
            </div>
            
            <div className="border-b border-slate-200 pb-3">
              <p className="text-sm text-slate-600">Highest Revenue Service</p>
              <p className="text-lg font-medium text-slate-800 capitalize">
                {Object.entries(revenueByType).reduce((max, [type, revenue]) => 
                  revenue > max.revenue ? { type, revenue } : max
                , { type: 'none', revenue: 0 }).type.replace('-', ' ')}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-600">Active Since</p>
              <p className="text-lg font-medium text-slate-800">
                {orders.length > 0 ? new Date(orders[orders.length - 1].createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
        </div>
        <div className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No recent activity to display
            </div>
          ) : (
            <div className="space-y-3">
              {orders
                .slice(0, 10)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((order) => (
                  <div key={order.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-slate-800">{order.orderNumber}</p>
                      <p className="text-sm text-slate-600">
                        {order.guestName || order.customerName || 'Walk-in'} • {order.type.replace('-', ' ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800">{formatCurrency(order.total)}</p>
                      <p className="text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
