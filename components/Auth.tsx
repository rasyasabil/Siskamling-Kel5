
import React, { useState } from 'react';
import { Shield, Lock, Mail, Loader2, User as UserIcon, CheckCircle } from 'lucide-react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../services/mockData';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('resident');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (isLogin) {
        // LOGIN LOGIC
        const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          onLogin(user);
        } else {
          setError('Email atau password salah.');
          setIsLoading(false);
        }
      } else {
        // REGISTER LOGIC
        if (!name || !email || !password) {
          setError('Mohon lengkapi semua data.');
          setIsLoading(false);
          return;
        }

        const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          setError('Email sudah terdaftar.');
          setIsLoading(false);
          return;
        }

        // Create new user object
        const newUser: User = {
          id: `u_${Date.now()}`,
          name: name,
          email: email,
          role: role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
        };

        // In a real app, we would POST to API here. 
        // For now, we push to mock and login immediately.
        MOCK_USERS.push(newUser);
        onLogin(newUser);
      }
    }, 1000);
  };

  const handleQuickLogin = (role: 'admin' | 'resident') => {
    setIsLoading(true);
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.role === role);
      if (user) onLogin(user);
    }, 800);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-50 p-6 text-center border-b border-blue-100">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Siskamling Online</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin ? 'Masuk untuk menjaga lingkungan kita.' : 'Daftar untuk menjadi bagian dari komunitas.'}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center animate-fade-in">
                {error}
              </div>
            )}
            
            {/* Name Input (Register Only) */}
            {!isLogin && (
              <div className="space-y-1 animate-fade-in">
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Nama Anda"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Role Selection (Register Only) */}
            {!isLogin && (
              <div className="space-y-1 animate-fade-in">
                <label className="text-sm font-medium text-gray-700">Daftar Sebagai</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('resident')}
                    className={`p-2.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      role === 'resident'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                     <UserIcon size={16} /> Warga
                     {role === 'resident' && <CheckCircle size={14} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (isLogin ? 'Masuk' : 'Daftar Sekarang')}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
              <button 
                onClick={toggleMode}
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </p>
          </div>

          {/* Quick Login (Demo Only - Only show on Login) */}
          {isLogin && (
            <div className="mt-8 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Quick Access</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('resident')}
                  className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-blue-200 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <LocalUserIcon size={16} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-600">Warga</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-blue-200 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <Shield size={16} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-600">Admin/RT</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper icon component for local use
const LocalUserIcon = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default Auth;
