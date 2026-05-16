'use client';

import { motion } from 'framer-motion';

interface AuthSidebarProps {
  imageSrc?: string;
}

export function AuthSidebar({ imageSrc = '/assets/Login.png' }: AuthSidebarProps = {}) {
  return (
    <div className="hidden lg:flex flex-col w-[45%] bg-[#121212] p-12 relative overflow-hidden shrink-0">
      {/* Brand */}
      <div className="z-10">
        <h1 className="text-white text-4xl font-black leading-tight tracking-tighter">
          ToDo<br />Mind
        </h1>
      </div>

      {/* Auth Illustration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12 z-0">
        <img 
          src={imageSrc}
          alt="To-Do Mind Illustration"
          className="w-full h-auto object-contain max-w-[450px] drop-shadow-2xl"
        />
      </div>

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
