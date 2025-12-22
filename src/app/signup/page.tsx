'use client';
import React, { useState } from 'react';
import { Sun, Moon, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import api from '../lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SignUpScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/signup', formData);
      
      toast.success("Account created! Redirecting...", {
        duration: 4000,
        style: { background: '#333', color: '#fff' },
      });
      router.push('/login');
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.detail || 'Signup failed');
      } else {
        setError("Cannot connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full rounded-lg py-3 px-4 outline-none transition-all border border-transparent focus:border-blue-500/50 bg-gray-50 text-gray-900 placeholder:text-gray-400 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:bg-[#1E1E1E] dark:text-white dark:placeholder:text-gray-600 dark:focus:bg-[#252525] dark:border-transparent";

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300 bg-gray-100 dark:bg-black">
        
        <div className="relative w-full max-w-[400px] rounded-3xl p-8 shadow-xl transition-all duration-300 border bg-white border-gray-200 dark:bg-[#121212] dark:border-white/5 dark:shadow-2xl">
          
          <div 
            onClick={toggleTheme}
            className="absolute top-6 right-6 cursor-pointer transition-colors p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-black/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative w-16 h-16 bg-gradient-to-b from-blue-400 to-cyan-300 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-white rounded-full rounded-tr-none" />
              </div>
            </div>

            <h1 className="mt-6 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Canvas
            </h1>
            
            <p className="mt-2 text-sm font-medium transition-colors text-gray-500 dark:text-gray-400">
              The sanctuary for human creativity.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <input
              name="username"
              type="text"
              placeholder="Username"
              className={inputStyle}
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className={inputStyle}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                className={`${inputStyle} pr-12`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button 
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm transition-colors text-gray-600 dark:text-gray-500">
                Back to{' '}
                <Link 
                    href="/login" 
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}