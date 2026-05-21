'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthSidebar } from '@/components/auth/AuthSidebar';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = () => {
    const user = {
      id: 'g-12345',
      name: 'Google User',
      email: 'user@gmail.com',
      provider: 'google',
      avatar: 'https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff'
    };
    localStorage.setItem('todo_user', JSON.stringify(user));
    router.push('/');
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      id: 'u-67890',
      name: 'Demo User',
      email: 'demo@example.com',
      provider: 'email',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=FFD700&color=121212'
    };
    localStorage.setItem('todo_user', JSON.stringify(user));
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <AuthSidebar />
      
      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-sm w-full space-y-10"
        >
          <h2 className="text-4xl font-black text-[#121212] tracking-tight">
            Sign in
          </h2>

          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="email.email@mail.com"
                className="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl py-4 px-5 text-sm font-medium text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 focus:border-[#FFD700] transition-all placeholder:text-[#121212]/30"
              />
            </div>
            
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••••••••••"
                className="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl py-4 px-5 pr-12 text-sm font-medium text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 focus:border-[#FFD700] transition-all placeholder:text-[#121212]/30"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/40 group-focus-within:text-[#121212] hover:text-[#121212] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-[#FFD700] hover:bg-[#FFC700] text-[#121212] font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] mt-4"
            >
              Sign in
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E9ECEF]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-muted-foreground font-medium uppercase tracking-widest">or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-3 py-3.5 bg-[#F8F9FA] hover:bg-[#E9ECEF] border border-[#E9ECEF] rounded-xl text-sm font-bold text-[#121212] transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3.5 bg-[#F8F9FA] hover:bg-[#E9ECEF] border border-[#E9ECEF] rounded-xl text-sm font-bold text-[#121212] transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <p className="text-sm font-medium text-center text-muted-foreground">
            Don&apos;t have an account? {' '}
            <Link href="/auth/register" className="text-[#121212] font-black hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
