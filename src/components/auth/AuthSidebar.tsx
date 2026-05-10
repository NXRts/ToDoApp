'use client';

import { motion } from 'framer-motion';

export function AuthSidebar() {
  return (
    <div className="hidden lg:flex flex-col w-[45%] bg-[#121212] p-12 relative overflow-hidden shrink-0">
      {/* Brand */}
      <div className="z-10">
        <h1 className="text-white text-4xl font-black leading-tight tracking-tighter">
          Organic<br />Mind
        </h1>
      </div>

      {/* Abstract Shapes Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full max-w-[400px] max-h-[400px]">
          {/* Yellow Shape Top */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-[15%] left-[20%] w-32 h-40 bg-[#B8860B] rounded-[40%_60%_70%_30% / 40%_50%_60%_40%] rotate-[-25deg]"
          />

          {/* Orange Shape Right */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="absolute top-[35%] right-[10%] w-36 h-36 bg-[#E67E22] rounded-[60%_40%_30%_70% / 50%_50%_60%_40%] rotate-[15deg]"
          />

          {/* Yellow Shape Bottom */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="absolute bottom-[10%] left-[25%] w-40 h-32 bg-[#F1C40F] rounded-[30%_70%_60%_40% / 40%_60%_50%_50%]"
          />

          {/* White Shapes & Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
            {/* Swirly Line 1 */}
            <motion.path
              d="M 120 120 Q 200 150 180 250 T 300 300"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, delay: 0.6 }}
            />
            {/* Swirly Line 2 */}
            <motion.path
              d="M 280 180 Q 250 250 320 280 T 350 400"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
            
            {/* Dots */}
            <motion.circle 
              cx="250" cy="200" r="4" fill="white" opacity="0.4"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
            />
            <motion.circle 
              cx="180" cy="320" r="3" fill="white" opacity="0.2"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }}
            />
            
            {/* Rings */}
            <motion.circle 
              cx="150" cy="250" r="20" fill="none" stroke="white" strokeWidth="1" opacity="0.2"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4 }}
            />
            <motion.circle 
              cx="150" cy="250" r="30" fill="none" stroke="white" strokeWidth="1" opacity="0.1"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }}
            />
          </svg>
        </div>
      </div>

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
