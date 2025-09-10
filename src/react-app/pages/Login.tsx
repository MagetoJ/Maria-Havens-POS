import { useState } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Hotel, LogIn, User, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, isPending } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const demoAccounts = [
    { email: 'admin@mariahavens.com', role: 'Super Admin', name: 'John Smith' },
    { email: 'manager@mariahavens.com', role: 'Manager', name: 'Sarah Johnson' },
    { email: 'staff@mariahavens.com', role: 'Staff', name: 'Michael Brown' },
    { email: 'cashier@mariahavens.com', role: 'Staff', name: 'Emma Wilson' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials. Use password "demo123" for all demo accounts.');
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl inline-block mb-4">
              <Hotel className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Maria Havens</h1>
            <p className="text-slate-600">Hotel Point of Sale System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-600 text-sm">Sign in to access the POS system</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showDemoAccounts ? 'Hide' : 'Show'} Demo Accounts
              </button>
            </div>
          </form>

          {/* Demo Accounts */}
          {showDemoAccounts && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Demo Accounts</h3>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => handleDemoLogin(account.email)}
                    className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{account.name}</p>
                        <p className="text-xs text-slate-600">{account.email}</p>
                        <p className="text-xs text-blue-600">{account.role}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">
                Password for all demo accounts: <strong>demo123</strong>
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
            <div className="text-blue-600 font-semibold text-sm mb-1">Room Service</div>
            <div className="text-xs text-slate-600">Manage room orders</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
            <div className="text-purple-600 font-semibold text-sm mb-1">Restaurant</div>
            <div className="text-xs text-slate-600">Handle dining orders</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
            <div className="text-green-600 font-semibold text-sm mb-1">Reports</div>
            <div className="text-xs text-slate-600">Track performance</div>
          </div>
        </div>
      </div>
    </div>
  );
}
