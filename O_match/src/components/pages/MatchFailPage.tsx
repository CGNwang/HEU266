import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 匹配失败页面
 * 当匹配引擎未找到匹配对象时展示
 */
const MatchFailPage: React.FC = () => {
  return (
    <main className="relative pt-32 pb-40 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[921px]">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-primary-container rounded-full blur-[60px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[250px] h-[250px] bg-tertiary-container rounded-full blur-[60px]" />
      </div>

      {/* Central Glassmorphic Card */}
      <section className="glass-card relative w-full rounded-[4rem] p-12 md:p-20 shadow-[0_32px_64px_-16px_rgba(148,74,0,0.1)] flex flex-col items-center text-center overflow-hidden outline outline-1 outline-white/20">
        {/* Main Visual */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-primary/15 rounded-full blur-xl animate-pulse" />
          {/* Main Icon */}
          <div className="relative z-10 flex flex-col items-center">
            <span className="material-symbols-outlined text-6xl text-primary leading-none" style={{ fontVariationSettings: '"FILL" 1, "wght" 200' }}>
              search_insights
            </span>
          </div>
          {/* Decorative Magnetic Rings */}
          <div className="absolute w-44 h-44 border border-primary/10 rounded-full" />
          <div className="absolute w-56 h-56 border border-primary/5 rounded-full" />
        </div>

        {/* Text Content */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6">
          宁缺毋滥
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-md leading-relaxed mb-12">
          本周未发现 100% 懂你的灵魂。
        </p>

        {/* CTA Buttons */}
        <Link
          to="/waiting"
          className="warm-gradient-btn text-white px-10 py-5 rounded-full text-lg font-bold shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto mb-4 w-full max-w-[280px]"
        >
          <span>参与下周匹配</span>
          <span className="material-symbols-outlined text-xl">keyboard_arrow_right</span>
        </Link>

        <Link
          to="/questionnaire"
          className="bg-on-surface/5 text-on-surface-variant px-10 py-5 rounded-full text-lg font-bold hover:bg-on-surface/10 hover:scale-[1.02] active:scale-95 transition-all mb-12 flex items-center justify-center gap-2 mx-auto w-full max-w-[280px]"
        >
          <span>修改我的问卷</span>
        </Link>

        {/* Encouragement Section */}
        <div className="w-full flex flex-col items-center">
          <div className="h-px w-24 bg-outline-variant/30 mb-8" />
          <p className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant/60 font-bold">
            宁缺毋滥，守候是为了更好的相遇
          </p>
        </div>
      </section>
    </main>
  );
};

export default MatchFailPage;