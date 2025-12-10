'use client';
import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import Link from 'next/link';
export default function SignUpScreen() {
 
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const inputClasses = (isDarkMode: boolean) => `
    w-full rounded-lg py-3 px-4 outline-none transition-all border border-transparent 
    focus:border-blue-500/50 
    ${isDarkMode 
      ? 'bg-[#1E1E1E] text-white placeholder:text-gray-600 focus:bg-[#252525]' 
      : 'bg-gray-50 text-gray-900 placeholder:text-gray-400 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100'
    }
  `;

  return (
    <div 
      className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300 
      ${isDarkMode ? 'bg-black' : 'bg-gray-100'}`}
    >
      
      <div 
        className={`relative w-full max-w-[400px] rounded-3xl p-8 shadow-2xl transition-all duration-300 border
        ${isDarkMode 
          ? 'bg-[#121212] border-white/5' 
          : 'bg-white border-gray-200 shadow-xl'
        }`}
      >
        
       
        <div 
          onClick={toggleTheme}
          className={`absolute top-6 right-6 cursor-pointer transition-colors p-2 rounded-full
          ${isDarkMode 
            ? 'text-gray-400 hover:text-white hover:bg-white/10' 
            : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
          }`}
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
          
          
          <p className={`mt-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            The sanctuary for human creativity.
          </p>
        </div>

        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          
         
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className={inputClasses(isDarkMode)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className={inputClasses(isDarkMode)}
            />
          </div>

       
          <input
            type="email"
            placeholder="Email Address"
            className={inputClasses(isDarkMode)}
          />

          <input
            type="password"
            placeholder="Create Password"
            className={inputClasses(isDarkMode)}
          />

       
          <button className="w-full mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98]">
            Create Account
          </button>

       
          <div className="text-center pt-2">
            <p className={`text-sm transition-colors ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
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
  );
}