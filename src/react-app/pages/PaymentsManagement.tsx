import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Banknote, Smartphone, Home } from 'lucide-react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { mockDB } from '@/react-app/data/mockDatabase';
import { formatCurrency } from '@/react-app/utils/currency';

interface Payment {
  id: string;
  orderId: string;
  orderNumber?: string;
  amount: number;
  method: 'cash' | 'credit' | 'debit' | 'room-charge' | 'mpesa';
  status: 'pending' | 'completed' | 'failed';
  transactionReference?: string;
  createdAt: string;
  processedByAdminId: string;
  processedByName?: string;
  customerName?: string;
}

export default function PaymentsManagement() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [paymentForm, setPaymentForm] = useState({
    method: 'cash' as Payment['method'],
    transactionReference: '',
    amount: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // In a real app, this would fetch from API
      const ordersData = await mockDB.getOrders();
      setOrders(ordersData);
      
      // Mock payments data - in real app would come from API
      setPayments([]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedOrder || !user) return;

    try {
      await mockDB.addPayment({
        orderId: selectedOrder.id,
        amount: paymentForm.amount || selectedOrder.total,
        paymentMethod: paymentForm.method,
        transactionReference: paymentForm.transactionReference,
        processedByAdminId: user.id
      });

      await fetchData();
      setShowPaymentModal(false);
      setSelectedOrder(null);
      setPaymentForm({ method: 'cash', transactionReference: '', amount: 0 });
      alert('Payment processed successfully!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  const paymentMethodConfig = {
    cash: { label: 'Cash', icon: Banknote, color: 'bg-green-100 text-green-800' },
    credit: { label: 'Credit Card', icon: CreditCard, color: 'bg-blue-100 text-blue-800' },
    debit: { label: 'Debit Card', icon: CreditCard, color: 'bg-purple-100 text-purple-800' },
    mpesa: { label: 'M-Pesa', icon: Smartphone, color: 'bg-green-100 text-green-800' },
    'room-charge': { label: 'Room Charge', icon: Home, color: 'bg-orange-100 text-orange-800' }
  };

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800' }
  };

  // Get unpaid orders for payment processing
  const unpaidOrders = orders.filter(order => order.status === 'delivered');

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
        <h1 className="text-2xl font-bold text-slate-800">Payments Management</h1>
        <p className="text-slate-600">Process payments and track payment history</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Processed</p>
              <p className="text-2xl font-bold text-slate-800">
                {formatCurrency(payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending Orders</p>
              <p className="text-2xl font-bold text-slate-800">{unpaidOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <Banknote className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Cash Payments</p>
              <p className="text-2xl font-bold text-slate-800">
                {payments.filter(p => p.method === 'cash' && p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Smartphone className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Digital Payments</p>
              <p className="text-2xl font-bold text-slate-800">
                {payments.filter(p => ['credit', 'debit', 'mpesa'].includes(p.method) && p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Unpaid Orders */}
      {unpaidOrders.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Orders Ready for Payment</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Order</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Customer</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Amount</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unpaidOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-slate-800">{order.orderNumber}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-slate-800">
                        {order.guestName || order.customerName || 'Walk-in'}
                      </p>
                      {order.roomNumber && (
                        <p className="text-sm text-slate-600">Room {order.roomNumber}</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-lg text-slate-800">
                        {formatCurrency(order.total)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setPaymentForm({ ...paymentForm, amount: order.total });
                          setShowPaymentModal(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Process Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Payment History</h2>
        </div>
        <div className="p-6">
          {payments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No payments processed yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-slate-700">Payment ID</th>
                    <th className="text-left py-3 px-6 font-medium text-slate-700">Order</th>
                    <th className="text-left py-3 px-6 font-medium text-slate-700">Amount</th>
                    <th className="text-left py-3 px-6 font-medium text-slate-700">Method</th>
                    <th className="text-left py-3 px-6 font-medium text-slate-700">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((payment) => {
                    const MethodIcon = paymentMethodConfig[payment.method].icon;
                    return (
                      <tr key={payment.id} className="hover:bg-slate-50">
                        <td className="py-4 px-6">
                          <p className="font-medium text-slate-800">{payment.id}</p>
                          {payment.transactionReference && (
                            <p className="text-sm text-slate-600">Ref: {payment.transactionReference}</p>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-slate-800">{payment.orderNumber}</p>
                          {payment.customerName && (
                            <p className="text-sm text-slate-600">{payment.customerName}</p>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-800">{formatCurrency(payment.amount)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${paymentMethodConfig[payment.method].color}`}>
                            <MethodIcon className="w-4 h-4" />
                            <span>{paymentMethodConfig[payment.method].label}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig[payment.status].color}`}>
                            {statusConfig[payment.status].label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-slate-600">
                            {new Date(payment.createdAt).toLocaleDateString()}
                            <br />
                            {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment Processing Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Process Payment</h2>
              <p className="text-sm text-slate-600">Order: {selectedOrder.orderNumber}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Amount
                </label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                />
                <p className="text-sm text-slate-600 mt-1">
                  Order total: {formatCurrency(selectedOrder.total)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as Payment['method'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="room-charge">Room Charge</option>
                </select>
              </div>
              
              {['credit', 'debit', 'mpesa'].includes(paymentForm.method) && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Transaction Reference
                  </label>
                  <input
                    type="text"
                    value={paymentForm.transactionReference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionReference: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter reference number"
                  />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedOrder(null);
                  setPaymentForm({ method: 'cash', transactionReference: '', amount: 0 });
                }}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayment}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
