import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super-admin' | 'admin' | 'manager' | 'staff';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isPending: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo admin accounts
const demoAdminUsers: AdminUser[] = [
  {
    id: 'admin-001',
    name: 'John Smith',
    email: 'admin@mariahavens.com',
    phone: '+254-712-345-678',
    role: 'super-admin',
    isActive: true,
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15T10:30:00'
  },
  {
    id: 'admin-002',
    name: 'Sarah Johnson',
    email: 'manager@mariahavens.com',
    phone: '+254-723-456-789',
    role: 'manager',
    isActive: true,
    createdAt: '2024-01-05',
    lastLogin: '2024-01-14T15:45:00'
  },
  {
    id: 'admin-003',
    name: 'Michael Brown',
    email: 'staff@mariahavens.com',
    role: 'staff',
    isActive: true,
    createdAt: '2024-01-10',
    lastLogin: '2024-01-13T09:20:00'
  },
  {
    id: 'admin-004',
    name: 'Emma Wilson',
    email: 'cashier@mariahavens.com',
    phone: '+254-734-567-890',
    role: 'staff',
    isActive: true,
    createdAt: '2024-01-12',
    lastLogin: '2024-01-12T16:15:00'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('maria_havens_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
    setIsPending(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsPending(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find demo user by email (password is always "demo123" for demo purposes)
    const adminUser = demoAdminUsers.find(u => u.email === email && u.isActive);
    
    if (adminUser && password === 'demo123') {
      const updatedUser = { ...adminUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('maria_havens_user', JSON.stringify(updatedUser));
      setIsPending(false);
      return true;
    }
    
    setIsPending(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('maria_havens_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export demo users for other components to access
export { demoAdminUsers };
