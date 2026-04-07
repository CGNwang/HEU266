import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/questionnaire', label: '问卷' },
    { path: '/waiting', label: '我的匹配' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={cn(
        'sticky top-4 mx-auto w-[92%] max-w-7xl rounded-2xl',
        'bg-white/70 dark:bg-stone-900/60 backdrop-blur-3xl',
        'outline outline-1 outline-orange-200/20 dark:outline-stone-700/20',
        'shadow-[0_4px_24px_rgba(28,28,24,0.04)]',
        'flex justify-between items-center px-5 md:px-8 py-3.5 z-50',
        className
      )}
    >
      {/* Logo */}
      <div className="text-xl md:text-2xl font-black text-orange-700 dark:text-orange-500 tracking-tighter">
        <Link to="/" className="flex items-center gap-1">
          🍊意配
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8 items-center font-manrope font-medium text-sm tracking-tight text-stone-600 dark:text-stone-400">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'hover:text-orange-600 transition-colors',
              isActive(item.path) && 'text-orange-700 dark:text-orange-400 font-bold border-b-2 border-orange-500 pb-1'
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-2 md:gap-4 text-orange-600 dark:text-orange-400">
        <Link
          to="/chat"
          className="p-2 hover:bg-orange-50/50 dark:hover:bg-stone-800/50 rounded-lg transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl">notifications</span>
        </Link>
        <Link
          to="/profile"
          className="p-2 hover:bg-orange-50/50 dark:hover:bg-stone-800/50 rounded-lg transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl">account_circle</span>
        </Link>
      </div>
    </nav>
  );
};

export default Header;