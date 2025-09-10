import { useEffect, useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router-dom';
import { Hotel, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallback() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        setStatus('success');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Authentication failed:', error);
        setStatus('error');
        setError('Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Logo */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl inline-block mb-6">
            <Hotel className="w-12 h-12 text-white" />
          </div>

          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Authenticating...</h2>
              <p className="text-slate-600">Please wait while we verify your credentials</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-green-600 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Welcome to Maria Havens!</h2>
              <p className="text-slate-600">Authentication successful. Redirecting to dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-red-600 mb-4">
                <XCircle className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Authentication Failed</h2>
              <p className="text-slate-600 mb-4">{error}</p>
              <p className="text-sm text-slate-500">You will be redirected to the login page shortly...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
