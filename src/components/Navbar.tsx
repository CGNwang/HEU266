import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Bell, UserCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { name: '首页', path: '/' },
    { name: '问卷', path: '/survey' },
    { name: '我的匹配', path: '/report' },
  ];

  return (
    <nav className="sticky top-4 mx-auto w-[95%] max-w-7xl rounded-2xl bg-white/60 backdrop-blur-3xl outline outline-1 outline-outline-variant/15 shadow-[0_8px_32px_rgba(28,28,24,0.06)] flex justify-between items-center px-8 py-4 z-50">
      <Link to="/" className="text-2xl font-black text-primary tracking-tighter flex items-center gap-2">
        <span>🍊</span>
        <span>意配</span>
      </Link>
      
      <div className="hidden md:flex gap-8 items-center font-medium text-sm tracking-tight text-on-surface-variant">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "transition-colors hover:text-primary",
              location.pathname === item.path && "text-primary font-bold border-b-2 border-primary-container pb-1"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
      
      <div className="flex items-center gap-4 text-primary">
        <button className="p-2 hover:bg-primary-fixed/30 rounded-lg transition-all active:scale-95">
          <GraduationCap size={20} />
        </button>
        <button className="p-2 hover:bg-primary-fixed/30 rounded-lg transition-all active:scale-95">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-primary-fixed/30 rounded-lg transition-all active:scale-95">
          <UserCircle size={20} />
        </button>
      </div>
    </nav>
  );
}
