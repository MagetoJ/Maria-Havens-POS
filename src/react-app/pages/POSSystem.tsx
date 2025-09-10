import { useState, useEffect } from 'react';
import MenuItemCard from '@/react-app/components/MenuItemCard';
import OrderSummary from '@/react-app/components/OrderSummary';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { mockDB } from '@/react-app/data/mockDatabase';
import { Store, Coffee, UtensilsCrossed } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

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

export default function POSSystem() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderType, setOrderType] = useState<'restaurant' | 'room-service' | 'bar'>('restaurant');
  const [roomNumber, setRoomNumber] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const data = await mockDB.getMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const orderTypeConfig = {
    restaurant: {
      icon: UtensilsCrossed,
      label: 'Restaurant',
      color: 'bg-green-500',
      inputPlaceholder: 'Table Number'
    },
    'room-service': {
      icon: Store,
      label: 'Room Service',
      color: 'bg-blue-500',
      inputPlaceholder: 'Room Number'
    },
    bar: {
      icon: Coffee,
      label: 'Bar',
      color: 'bg-purple-500',
      inputPlaceholder: 'Table/Seat Number'
    }
  };

  const createNewOrder = () => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      roomNumber: orderType === 'room-service' ? roomNumber : undefined,
      tableNumber: orderType !== 'room-service' ? tableNumber : undefined,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: 'pending',
      type: orderType,
      createdAt: new Date().toISOString(),
    };
    setCurrentOrder(newOrder);
  };

  const addItemToOrder = (menuItem: MenuItem, quantity: number = 1, notes?: string) => {
    if (!currentOrder) {
      createNewOrder();
      // Wait for next render cycle
      setTimeout(() => addItemToOrder(menuItem, quantity, notes), 0);
      return;
    }

    const orderItem: OrderItem = {
      id: `item-${Date.now()}`,
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      notes,
    };

    const updatedOrder = {
      ...currentOrder,
      items: [...currentOrder.items, orderItem],
    };

    // Recalculate totals
    const subtotal = updatedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax;

    updatedOrder.subtotal = subtotal;
    updatedOrder.tax = tax;
    updatedOrder.total = total;

    setCurrentOrder(updatedOrder);
  };

  const removeItemFromOrder = (itemId: string) => {
    if (!currentOrder) return;

    const updatedOrder = {
      ...currentOrder,
      items: currentOrder.items.filter(item => item.id !== itemId),
    };

    // Recalculate totals
    const subtotal = updatedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    updatedOrder.subtotal = subtotal;
    updatedOrder.tax = tax;
    updatedOrder.total = total;

    setCurrentOrder(updatedOrder);
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (!currentOrder || quantity < 1) return;

    const updatedOrder = {
      ...currentOrder,
      items: currentOrder.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ),
    };

    // Recalculate totals
    const subtotal = updatedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    updatedOrder.subtotal = subtotal;
    updatedOrder.tax = tax;
    updatedOrder.total = total;

    setCurrentOrder(updatedOrder);
  };

  const submitOrder = async () => {
    if (!currentOrder || currentOrder.items.length === 0 || !user) return;

    try {
      await mockDB.addOrder({
        roomNumber: currentOrder.roomNumber,
        tableNumber: currentOrder.tableNumber,
        customerName: currentOrder.customerName,
        orderType: currentOrder.type,
        items: currentOrder.items,
        subtotal: currentOrder.subtotal,
        tax: currentOrder.tax,
        total: currentOrder.total,
        notes: currentOrder.notes,
        createdByAdminId: user.id
      });

      setCurrentOrder(null);
      setRoomNumber('');
      setTableNumber('');
      alert('Order submitted successfully!');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    }
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Menu Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Type Selection */}
        {!currentOrder && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Start New Order</h2>
            
            {/* Order Type Tabs */}
            <div className="flex space-x-1 mb-4">
              {Object.entries(orderTypeConfig).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setOrderType(type as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      orderType === type
                        ? `${config.color} text-white`
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Location Input */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder={orderTypeConfig[orderType].inputPlaceholder}
                value={orderType === 'room-service' ? roomNumber : tableNumber}
                onChange={(e) => {
                  if (orderType === 'room-service') {
                    setRoomNumber(e.target.value);
                  } else {
                    setTableNumber(e.target.value);
                  }
                }}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={createNewOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Start Order
              </button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToOrder={(item) => addItemToOrder(item)}
            />
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <OrderSummary
          order={currentOrder}
          onUpdateQuantity={updateItemQuantity}
          onRemoveItem={removeItemFromOrder}
          onSubmitOrder={submitOrder}
          onClearOrder={clearCurrentOrder}
        />
      </div>
    </div>
  );
}
