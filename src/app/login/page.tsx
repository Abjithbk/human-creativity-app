'use client'
import React, { useState } from 'react'
import { User, Lock, Sun,Moon } from 'lucide-react';
const Login = () => {
    const [isDark, setIsDark] = useState(true)

    const toggle = () => {
      setIsDark(!isDark)
    }
  return (
    <div className={`min-h-screen w-ful flex items-center justify-center p-4 ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
      
      <div className={`relative w-full max-w-[400px]  rounded-3xl p-8 border  shadow-2xl ${isDark 
          ? 'bg-[#121212] border-white/5' 
          : 'bg-white border-gray-200 shadow-xl'}`}>
        
      
        <div onClick={toggle} className={`absolute top-6 right-6 p-2 rounded-full cursor-pointer transition-colors ${isDark 
            ? 'text-gray-400 hover:text-white hover:bg-white/10' 
            : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
          }`}>
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
          
         
          <p className={`mt-2 text-sm font-medium transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            The sanctuary for human creativity.
          </p>
        </div>

        
        <form className="space-y-6">
          
         
          <div className="space-y-2">
            <label className={`text-xs font-semibold ml-1 block transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Username or Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className={`h-5 w-5 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'} group-focus-within:text-blue-400`} />
              </div>
              <input
                type="text"
                placeholder="Enter your ID"
                className={`w-full rounded-lg py-3 pl-10 pr-4 outline-none transition-all border border-transparent focus:border-blue-500/50
                ${isDark 
                  ? 'bg-[#1E1E1E] text-white placeholder:text-gray-600 focus:bg-[#252525]' 
                  : 'bg-gray-50 text-gray-900 placeholder:text-gray-400 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
          </div>

          
          <div className="space-y-2">
            <label className={`text-xs font-semibold ml-1 block transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'} group-focus-within:text-blue-400`} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full rounded-lg py-3 pl-10 pr-4 outline-none transition-all border border-transparent focus:border-blue-500/50
                ${isDark 
                  ? 'bg-[#1E1E1E] text-white placeholder:text-gray-600 focus:bg-[#252525]' 
                  : 'bg-gray-50 text-gray-900 placeholder:text-gray-400 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
          </div>

          
          <button className="w-full mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98]">
            Log In
          </button>

          <div className="text-center mt-6">
            <p className={`text-sm transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign Up
              </a>
            </p>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Login
