'use client';

import Image from 'next/image';

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
        <div className="relative w-full h-full max-w-[450px]">
          <Image
            src={imageSrc}
            alt="To-Do Mind Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
