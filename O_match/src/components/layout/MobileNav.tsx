import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils';

export const MobileNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页', icon: 'home', activeIcon: 'home' },
    { path: '/questionnaire', label: '问卷', icon: 'quiz', activeIcon: 'quiz' },
    { path: '/waiting', label: '我的匹配', icon: 'person_search', activeIcon: 'person_search' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] z-[110]">
      <nav
        className={cn(
          'glass-panel py-3 px-6 rounded-3xl shadow-2xl',
          'flex justify-between items-center backdrop-blur-3xl border-orange-100/30'
        )}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center gap-1 transition-colors',
              isActive(item.path)
                ? 'text-orange-700'
                : 'text-on-surface-variant/60 hover:text-orange-600'
            )}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.path === '/' && location.pathname === '/' ? item.activeIcon : item.icon}
            </span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;