import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * 匹配成功页面
 * 当匹配引擎找到匹配对象后展示
 */
const MatchSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  // 点击"点击拆开"按钮后跳转匹配报告页
  const handleReveal = () => {
    // TODO: 对接后端 API 获取匹配报告数据
    // const fetchReport = async () => {
    //   const response = await fetch('/api/matching/report', {
    //     headers: { 'Authorization': `Bearer ${getToken()}` }
    //   });
    //   const data = await response.json();
    //   // 根据数据渲染报告页
    //   navigate('/match-report', { state: { data } });
    // };
    // fetchReport();

    // 直接跳转（数据在匹配报告页加载）
    navigate('/match-report');
  };

  return (
    <main className="relative pt-32 pb-40 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[921px]">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-primary-container/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[350px] h-[350px] bg-tertiary-container/10 rounded-full blur-[60px]" />
      </div>

      {/* Central Glassmorphic Card */}
      <div className="glass-card relative w-full rounded-[4rem] p-12 md:p-20 shadow-[0_32px_64px_-16px_rgba(148,74,0,0.1)] flex flex-col items-center text-center overflow-hidden outline outline-1 outline-white/20">
        {/* Icon Circle */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/15 rounded-full blur-xl animate-pulse" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative group transition-all duration-700">
              {/* Main Envelope Icon */}
              <span className="material-symbols-outlined text-7xl text-primary leading-none" style={{ fontVariationSettings: '"FILL" 0, "wght" 100' }}>
                mail
              </span>
              {/* Heart Detail on Flap Area */}
              <div className="absolute top-[34%] left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                <div className="w-[18px] h-[18px] bg-primary rounded-full flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.1),inset_0_-1px_1px_rgba(0,0,0,0.1)] border border-white/20 group-hover:scale-105 transition-transform duration-500">
                  <span className="material-symbols-outlined text-white text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>favorite</span>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Magnetic Rings */}
          <div className="absolute w-44 h-44 border border-primary/10 rounded-full" />
          <div className="absolute w-56 h-56 border border-primary/5 rounded-full" />
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <span className="block text-primary font-bold tracking-[0.2em] text-xs uppercase opacity-80 mb-4">Soul Message</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6">你有一份灵魂来信</h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-md leading-relaxed mb-12">请查收这份专属的缘分</p>
        </div>

        {/* Button */}
        <button
          onClick={handleReveal}
          className="px-10 py-5 bg-gradient-to-r from-primary to-primary-container text-white font-bold text-lg rounded-full shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all mb-16 flex items-center gap-4"
        >
          <span>点击拆开</span>
          <span className="material-symbols-outlined text-xl">keyboard_arrow_right</span>
        </button>
      </div>

      {/* Scroll Guide */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-on-surface-variant/40 animate-bounce">
          <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Tap to reveal</span>
          <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
        </div>
      </div>
    </main>
  );
};

export default MatchSuccessPage;