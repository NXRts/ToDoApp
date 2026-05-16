'use client';

import Link from 'next/link';
import { AuthSidebar } from '@/components/auth/AuthSidebar';
import { motion } from 'framer-motion';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AuthSidebar imageSrc="/assets/welcome.png" />
      
      {/* Right Panel - Welcome */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center space-y-8 relative z-10"
        >
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-[#121212] tracking-tight">
              Productive Mind
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed px-4">
              With only the features you need, ToDo Mind is customized for individuals seeking a stress-free way to stay focused on their goals, projects, and tasks.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <Link 
              href="/auth/register"
              className="block w-full py-4 bg-[#FFD700] hover:bg-[#FFC700] text-[#121212] font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Get Started
            </Link>
            
            <p className="text-sm font-medium text-muted-foreground">
              Already have an account? {' '}
              <Link href="/auth/login" className="text-[#121212] font-black hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
