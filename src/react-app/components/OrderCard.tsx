import { Clock, CheckCircle, Truck, DollarSign, MapPin, User } from 'lucide-react';
import { formatCurrency } from '@/react-app/utils/currency';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  roomNumber?: string;
  tableNumber?: string;
  customerName?: string;
  guestName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'paid';
  type: 'room-service' | 'restaurant' | 'bar';
  createdAt: string;
  createdByName?: string;
  notes?: string;
}

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: string) => void;
}

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-800', icon: Clock },
    ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    delivered: { label: 'Delivered', color: 'bg-purple-100 text-purple-800', icon: Truck },
    paid: { label: 'Paid', color: 'bg-gray-100 text-gray-800', icon: DollarSign }
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'delivered',
      delivered: 'paid'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const getNextStatusLabel = (currentStatus: string) => {
    const labels = {
      pending: 'Start Preparing',
      preparing: 'Mark Ready',
      ready: 'Mark Delivered',
      delivered: 'Mark Paid'
    };
    return labels[currentStatus as keyof typeof labels];
  };

  const StatusIcon = statusConfig[order.status].icon;
  const nextStatus = getNextStatus(order.status);
  const nextStatusLabel = getNextStatusLabel(order.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">{order.orderNumber}</h3>
          <p className="text-sm text-slate-600">
            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
          <StatusIcon className="w-4 h-4" />
          <span>{statusConfig[order.status].label}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700">{order.guestName || order.customerName || 'Walk-in Customer'}</span>
        </div>
        
        {(order.roomNumber || order.tableNumber) && (
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-slate-700">
              {order.roomNumber ? `Room ${order.roomNumber}` : `Table ${order.tableNumber}`}
            </span>
          </div>
        )}
        
        <div className="text-sm">
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            order.type === 'room-service' ? 'bg-blue-100 text-blue-800' :
            order.type === 'restaurant' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {order.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-700 mb-2">Items</h4>
        <div className="space-y-1">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="text-slate-600">
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium text-slate-800">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-slate-500">
              +{order.items.length - 3} more items
            </p>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="mb-4 pt-3 border-t border-slate-200">
        <div className="flex justify-between items-center">
          <span className="font-medium text-slate-700">Total</span>
          <span className="text-lg font-bold text-slate-800">{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* Actions */}
      {nextStatus && (
        <div className="flex space-x-2">
          <button
            onClick={() => onUpdateStatus(order.id, nextStatus)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
          >
            {nextStatusLabel}
          </button>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-600">
            <span className="font-medium">Notes: </span>
            {order.notes}
          </p>
        </div>
      )}

      {/* Created by */}
      {order.createdByName && (
        <div className="mt-2">
          <p className="text-xs text-slate-500">
            Created by {order.createdByName}
          </p>
        </div>
      )}
    </div>
  );
}
