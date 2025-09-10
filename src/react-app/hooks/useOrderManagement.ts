import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { mockDB } from '@/react-app/data/mockDatabase';

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
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'paid';
  type: 'room-service' | 'restaurant' | 'bar';
  createdAt: string;
  createdByAdminId: string;
  notes?: string;
}

export function useOrderManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  const createOrder = async (orderData: {
    roomNumber?: string;
    tableNumber?: string;
    customerName?: string;
    guestId?: string;
    orderType: 'room-service' | 'restaurant' | 'bar';
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    notes?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await mockDB.addOrder({
        ...orderData,
        createdByAdminId: user.id
      });
      await fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await mockDB.updateOrderStatus(orderId, status);
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    refetch: fetchOrders
  };
}
