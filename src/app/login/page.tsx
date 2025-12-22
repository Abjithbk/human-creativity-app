'use client'
import React, { useState } from 'react'
import { User, Lock, Sun, Moon, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const Login = () => {
    const router = useRouter();
    
    // UI States
    const [isDark, setIsDark] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // <--- New State

    const [formData, setFormData] = useState({
      identifier: '', 
      password: ''
    });

    const toggle = () => setIsDark(!isDark);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      const loadingToast = toast.loading('Authenticating...');

      try {
        const res = await api.post('/auth/login', {
          identifier: formData.identifier,
          password: formData.password
        });

        localStorage.setItem('token', res.data.access_token);

        toast.dismiss(loadingToast);
        toast.success("Welcome back!", {
          style: { background: '#333', color: '#fff' },
        });
        
        router.push('/Home'); 

      } catch (err: any) {
        toast.dismiss(loadingToast);
        const errorMessage = err.response?.data?.detail || "Login failed";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const labelStyle = "text-xs font-semibold ml-1 block transition-colors text-gray-700 dark:text-gray-300";
    const iconStyle = "h-5 w-5 transition-colors text-gray-400 group-focus-within:text-blue-400 dark:text-gray-500";
    // Added pr-12 to ensure text doesn't overlap with the eye icon
    const inputStyle = "w-full rounded-lg py-3 pl-10 pr-12 outline-none transition-all border border-transparent focus:border-blue-500/50 bg-gray-50 text-gray-900 placeholder:text-gray-400 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:bg-[#1E1E1E] dark:text-white dark:placeholder:text-gray-600 dark:focus:bg-[#252525] dark:border-transparent";

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors bg-gray-100 dark:bg-black">
        
        <div className="relative w-full max-w-[400px] rounded-3xl p-8 border shadow-xl bg-white border-gray-200 dark:bg-[#121212] dark:border-white/5 dark:shadow-2xl">
          
          <div 
            onClick={toggle} 
            className="absolute top-6 right-6 p-2 rounded-full cursor-pointer transition-colors text-gray-500 hover:text-gray-900 hover:bg-black/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10"
          >
           {isDark ? <Sun size={20} /> : <Moon size={20} />}
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

          <form className="space-y-6" onSubmit={handleLogin}>
            
            <div className="space-y-2">
              <label className={labelStyle}>
                Username or Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={iconStyle} />
                </div>
                <input
                  name="identifier"
                  type="text"
                  placeholder="Enter your ID"
                  className={inputStyle}
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={iconStyle} />
                </div>
                
                {/* Password Input with Dynamic Type */}
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={inputStyle}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                {/* Show/Hide Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Log In"}
            </button>

            <div className="text-center mt-6">
              <p className="text-sm transition-colors text-gray-600 dark:text-gray-500">
                Don't have an account?{' '}
                <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login