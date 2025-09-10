import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
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
  roomNumber?: string;
  tableNumber?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'paid';
  type: 'room-service' | 'restaurant' | 'bar';
  createdAt: string;
  notes?: string;
}

interface OrderSummaryProps {
  order: Order | null;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSubmitOrder: () => void;
  onClearOrder: () => void;
}

export default function OrderSummary({
  order,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
  onClearOrder,
}: OrderSummaryProps) {
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSubmitOrder();
    setCustomerName('');
    setNotes('');
  };

  if (!order) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No Active Order</h3>
          <p className="text-sm text-slate-500">Start a new order to see details here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-slate-800">Current Order</h2>
          <button
            onClick={onClearOrder}
            className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm text-slate-600">
          {order.type === 'room-service' && order.roomNumber && (
            <p>Room: {order.roomNumber}</p>
          )}
          {order.type !== 'room-service' && order.tableNumber && (
            <p>Table: {order.tableNumber}</p>
          )}
          <p className="capitalize">{order.type.replace('-', ' ')}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-sm font-medium text-slate-700 mb-4">Items</h3>
        {order.items.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No items added yet</p>
        ) : (
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-600">{formatCurrency(item.price)} each</p>
                  {item.notes && (
                    <p className="text-xs text-slate-500 italic">Note: {item.notes}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-3">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium text-slate-800 w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="text-slate-500 hover:text-slate-700 p-1 rounded"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded ml-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="p-6 border-b border-slate-200 space-y-4">
        {order.type !== 'room-service' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Customer Name (Optional)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter customer name"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Order Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            placeholder="Add special instructions..."
          />
        </div>
      </div>

      {/* Order Total */}
      <div className="p-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className="text-slate-800">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Tax (8%)</span>
            <span className="text-slate-800">{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t border-slate-200 pt-2">
            <span className="text-slate-800">Total</span>
            <span className="text-blue-600">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6">
        <button
          onClick={handleSubmit}
          disabled={order.items.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}
