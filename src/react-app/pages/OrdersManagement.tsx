import { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle, Truck, DollarSign, Eye } from 'lucide-react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { mockDB } from '@/react-app/data/mockDatabase';
import { formatCurrency } from '@/react-app/utils/currency';

interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  roomNumber?: string;
  tableNumber?: string;
  customerName?: string;
  guestId?: string;
  guestName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'paid';
  type: 'room-service' | 'restaurant' | 'bar';
  createdAt: string;
  createdByAdminId: string;
  createdByName?: string;
  notes?: string;
}

export default function OrdersManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await mockDB.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await mockDB.updateOrderStatus(orderId, status);
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.roomNumber?.includes(searchTerm) ||
      order.tableNumber?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-800', icon: Clock },
    ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    delivered: { label: 'Delivered', color: 'bg-purple-100 text-purple-800', icon: Truck },
    paid: { label: 'Paid', color: 'bg-gray-100 text-gray-800', icon: DollarSign }
  };

  const orderTypeBadgeColor = {
    'room-service': 'bg-blue-100 text-blue-800',
    'restaurant': 'bg-green-100 text-green-800',
    'bar': 'bg-purple-100 text-purple-800'
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Orders Management</h1>
        <p className="text-slate-600">Track and manage all orders</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          const count = orders.filter(o => o.status === status).length;
          return (
            <div key={status} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${config.color.replace('text-', 'text-').replace('bg-', 'bg-opacity-20 ')}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">{config.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="room-service">Room Service</option>
              <option value="restaurant">Restaurant</option>
              <option value="bar">Bar</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTypeFilter('all');
            }}
            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Order</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Customer</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Type</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Items</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Total</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-slate-800">{order.orderNumber}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {order.createdByName && (
                          <p className="text-xs text-slate-500">by {order.createdByName}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-slate-800">
                          {order.guestName || order.customerName || 'Walk-in'}
                        </p>
                        {order.roomNumber && (
                          <p className="text-sm text-slate-600">Room {order.roomNumber}</p>
                        )}
                        {order.tableNumber && (
                          <p className="text-sm text-slate-600">Table {order.tableNumber}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${orderTypeBadgeColor[order.type]}`}>
                        {order.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-slate-800">{order.items.length} items</p>
                      <div className="text-xs text-slate-600">
                        {order.items.slice(0, 2).map(item => 
                          `${item.quantity}x ${item.name}`
                        ).join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-800">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span>{statusConfig[order.status].label}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Status Update Buttons */}
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                          >
                            Start
                          </button>
                        )}
                        
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="text-green-600 hover:text-green-700 text-xs px-2 py-1 border border-green-200 rounded hover:bg-green-50 transition-colors"
                          >
                            Ready
                          </button>
                        )}
                        
                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="text-purple-600 hover:text-purple-700 text-xs px-2 py-1 border border-purple-200 rounded hover:bg-purple-50 transition-colors"
                          >
                            Deliver
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{selectedOrder.orderNumber}</h2>
                  <p className="text-sm text-slate-600">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Customer Information</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p><strong>Name:</strong> {selectedOrder.guestName || selectedOrder.customerName || 'Walk-in'}</p>
                  {selectedOrder.roomNumber && <p><strong>Room:</strong> {selectedOrder.roomNumber}</p>}
                  {selectedOrder.tableNumber && <p><strong>Table:</strong> {selectedOrder.tableNumber}</p>}
                  <p><strong>Type:</strong> {selectedOrder.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  {selectedOrder.notes && <p><strong>Notes:</strong> {selectedOrder.notes}</p>}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-50 rounded-lg p-4">
                      <div>
                        <p className="font-medium text-slate-800">{item.name}</p>
                        {item.notes && <p className="text-sm text-slate-600">Note: {item.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-800">
                          {item.quantity} × {formatCurrency(item.price)}
                        </p>
                        <p className="text-sm text-slate-600">
                          {formatCurrency(item.quantity * item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Order Summary</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t border-slate-200 pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
