import { MenuItem, Guest } from '@/shared/types';
import { demoAdminUsers } from '@/react-app/contexts/AuthContext';

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  // Appetizers
  {
    id: 'app-001',
    name: 'Bruschetta Trio',
    description: 'Three varieties of toasted bread with fresh toppings',
    price: 1450,
    category: 'Appetizers',
    available: true,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300&h=200&fit=crop'
  },
  {
    id: 'app-002',
    name: 'Shrimp Cocktail',
    description: 'Fresh gulf shrimp with cocktail sauce',
    price: 1800,
    category: 'Appetizers',
    available: true,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300&h=200&fit=crop'
  },
  {
    id: 'app-003',
    name: 'Caesar Salad',
    description: 'Crisp romaine, parmesan, croutons, house dressing',
    price: 1200,
    category: 'Appetizers',
    available: true,
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=300&h=200&fit=crop'
  },

  // Main Course
  {
    id: 'main-001',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with lemon herb butter and seasonal vegetables',
    price: 2800,
    category: 'Main Course',
    available: true,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop'
  },
  {
    id: 'main-002',
    name: 'Beef Tenderloin',
    description: '8oz tenderloin with garlic mashed potatoes',
    price: 3500,
    category: 'Main Course',
    available: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop'
  },
  {
    id: 'main-003',
    name: 'Chicken Parmesan',
    description: 'Breaded chicken breast with marinara and mozzarella',
    price: 2200,
    category: 'Main Course',
    available: true,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop'
  },
  {
    id: 'main-004',
    name: 'Ugali & Nyama Choma',
    description: 'Traditional grilled meat with ugali and sukuma wiki',
    price: 1800,
    category: 'Main Course',
    available: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop'
  },

  // Desserts
  {
    id: 'dess-001',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center and vanilla ice cream',
    price: 950,
    category: 'Desserts',
    available: true,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop'
  },
  {
    id: 'dess-002',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 850,
    category: 'Desserts',
    available: true,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop'
  },

  // Beverages
  {
    id: 'bev-001',
    name: 'Freshly Brewed Coffee',
    description: 'Premium coffee blend',
    price: 350,
    category: 'Beverages',
    available: true,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=300&h=200&fit=crop'
  },
  {
    id: 'bev-002',
    name: 'Fresh Orange Juice',
    description: 'Squeezed daily',
    price: 450,
    category: 'Beverages',
    available: true,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=200&fit=crop'
  },
  {
    id: 'bev-003',
    name: 'Kenyan Tea (Chai)',
    description: 'Traditional spiced tea',
    price: 300,
    category: 'Beverages',
    available: true,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=200&fit=crop'
  },

  // Room Service
  {
    id: 'room-001',
    name: 'Continental Breakfast',
    description: 'Pastries, fruit, coffee, and juice delivered to your room',
    price: 1600,
    category: 'Room Service',
    available: true,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&h=200&fit=crop'
  },
  {
    id: 'room-002',
    name: 'Late Night Snack Platter',
    description: 'Assorted cheeses, crackers, and fruits',
    price: 2400,
    category: 'Room Service',
    available: true,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=200&fit=crop'
  },

  // Bar
  {
    id: 'bar-001',
    name: 'House Wine',
    description: 'Red or white wine by the glass',
    price: 800,
    category: 'Bar',
    available: true,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=200&fit=crop'
  },
  {
    id: 'bar-002',
    name: 'Tusker Beer',
    description: 'Local Kenyan lager',
    price: 400,
    category: 'Bar',
    available: true,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=200&fit=crop'
  },
  {
    id: 'bar-003',
    name: 'Whiskey',
    description: 'Premium whiskey selection',
    price: 1200,
    category: 'Bar',
    available: true,
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=300&h=200&fit=crop'
  }
];

// Mock Guests
let mockGuests: Guest[] = [
  {
    id: 'guest-001',
    name: 'John Smith',
    roomNumber: '101',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    email: 'john.smith@email.com',
    phone: '+254-712-345-678'
  },
  {
    id: 'guest-002',
    name: 'Sarah Johnson',
    roomNumber: '205',
    checkIn: '2024-01-16',
    checkOut: '2024-01-20',
    email: 'sarah.j@email.com',
    phone: '+254-723-456-789'
  },
  {
    id: 'guest-003',
    name: 'Michael Brown',
    roomNumber: '312',
    checkIn: '2024-01-14',
    checkOut: '2024-01-17',
    email: 'mbrown@email.com',
    phone: '+254-734-567-890'
  },
  {
    id: 'guest-004',
    name: 'Mary Wanjiku',
    roomNumber: '203',
    checkIn: '2024-01-16',
    checkOut: '2024-01-19',
    email: 'mary.w@email.com',
    phone: '+254-701-234-567'
  }
];

// Mock Orders
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

let mockOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'ORD-001',
    roomNumber: '101',
    guestId: 'guest-001',
    items: [
      { id: 'item-001', menuItemId: 'room-001', name: 'Continental Breakfast', price: 1600, quantity: 1 },
      { id: 'item-002', menuItemId: 'bev-001', name: 'Freshly Brewed Coffee', price: 350, quantity: 2 }
    ],
    subtotal: 2300,
    tax: 184,
    total: 2484,
    status: 'delivered',
    type: 'room-service',
    createdAt: '2024-01-15T08:30:00',
    createdByAdminId: 'admin-003'
  },
  {
    id: 'order-002',
    orderNumber: 'ORD-002',
    tableNumber: 'T5',
    customerName: 'Walk-in Customer',
    items: [
      { id: 'item-003', menuItemId: 'main-001', name: 'Grilled Salmon', price: 2800, quantity: 1 },
      { id: 'item-004', menuItemId: 'bev-002', name: 'Fresh Orange Juice', price: 450, quantity: 1 }
    ],
    subtotal: 3250,
    tax: 260,
    total: 3510,
    status: 'paid',
    type: 'restaurant',
    createdAt: '2024-01-15T12:15:00',
    createdByAdminId: 'admin-002'
  }
];

// Mock Payments
interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'cash' | 'credit' | 'debit' | 'room-charge' | 'mpesa';
  status: 'pending' | 'completed' | 'failed';
  transactionReference?: string;
  createdAt: string;
  processedByAdminId: string;
}

let mockPayments: Payment[] = [
  {
    id: 'payment-001',
    orderId: 'order-002',
    amount: 3510,
    method: 'credit',
    status: 'completed',
    transactionReference: 'TXN-12345',
    createdAt: '2024-01-15T12:30:00',
    processedByAdminId: 'admin-002'
  }
];

// Database simulation functions
class MockDatabase {
  // Admin Users
  async getAdminUsers() {
    return demoAdminUsers;
  }

  async addAdminUser(userData: any) {
    const newUser = {
      id: `admin-${Date.now()}`,
      ...userData,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    demoAdminUsers.push(newUser);
    return newUser;
  }

  // Guests
  async getGuests() {
    return mockGuests;
  }

  async addGuest(guestData: any) {
    const newGuest = {
      id: `guest-${Date.now()}`,
      ...guestData,
      checkIn: guestData.checkInDate,
      checkOut: guestData.checkOutDate
    };
    mockGuests.push(newGuest);
    return newGuest;
  }

  async updateGuest(guestId: string, updates: any) {
    const index = mockGuests.findIndex(g => g.id === guestId);
    if (index !== -1) {
      mockGuests[index] = { ...mockGuests[index], ...updates };
      return mockGuests[index];
    }
    return null;
  }

  async deleteGuest(guestId: string) {
    mockGuests = mockGuests.filter(g => g.id !== guestId);
    return true;
  }

  // Menu Items
  async getMenuItems() {
    return mockMenuItems;
  }

  // Orders
  async getOrders() {
    return mockOrders.map(order => ({
      ...order,
      guestName: order.guestId ? mockGuests.find(g => g.id === order.guestId)?.name : undefined,
      createdByName: demoAdminUsers.find(a => a.id === order.createdByAdminId)?.name
    }));
  }

  async addOrder(orderData: any) {
    const newOrder = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString()
    };
    mockOrders.push(newOrder);
    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const index = mockOrders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      mockOrders[index].status = status as any;
      return mockOrders[index];
    }
    return null;
  }

  // Payments
  async addPayment(paymentData: any) {
    const newPayment = {
      id: `payment-${Date.now()}`,
      ...paymentData,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    mockPayments.push(newPayment);
    
    // Update order status to paid
    this.updateOrderStatus(paymentData.orderId, 'paid');
    
    return newPayment;
  }

  // Sales Reports
  async getSalesReports() {
    const salesByAdmin = demoAdminUsers.map(admin => {
      const adminOrders = mockOrders.filter(o => o.createdByAdminId === admin.id);
      const paidOrders = adminOrders.filter(o => o.status === 'paid');
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = paidOrders.filter(o => o.createdAt.startsWith(today));
      
      return {
        name: admin.name,
        role: admin.role,
        total_orders: adminOrders.length,
        total_revenue: paidOrders.reduce((sum, order) => sum + order.total, 0),
        today_revenue: todayOrders.reduce((sum, order) => sum + order.total, 0)
      };
    }).sort((a, b) => b.total_revenue - a.total_revenue);

    return { salesByAdmin };
  }
}

export const mockDB = new MockDatabase();

// Export for direct access
export { mockGuests, mockOrders, mockPayments };
