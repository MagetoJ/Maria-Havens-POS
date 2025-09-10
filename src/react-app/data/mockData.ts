import { MenuItem, Guest } from '@/shared/types';

export const menuCategories = [
  'Appetizers',
  'Main Course',
  'Desserts',
  'Beverages',
  'Room Service',
  'Bar'
];

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
    name: 'Craft Beer',
    description: 'Local brewery selection',
    price: 650,
    category: 'Bar',
    available: true,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=200&fit=crop'
  }
];

export const mockGuests: Guest[] = [
  {
    id: 'guest-001',
    name: 'John Smith',
    roomNumber: '101',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    email: 'john.smith@email.com',
    phone: '+1-555-0123'
  },
  {
    id: 'guest-002',
    name: 'Sarah Johnson',
    roomNumber: '205',
    checkIn: '2024-01-16',
    checkOut: '2024-01-20',
    email: 'sarah.j@email.com',
    phone: '+1-555-0456'
  },
  {
    id: 'guest-003',
    name: 'Michael Brown',
    roomNumber: '312',
    checkIn: '2024-01-14',
    checkOut: '2024-01-17',
    email: 'mbrown@email.com',
    phone: '+1-555-0789'
  }
];
