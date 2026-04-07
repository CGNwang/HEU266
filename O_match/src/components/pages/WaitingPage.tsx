import React, { useEffect, useState } from 'react';
import { getMatchingStatus, joinMatching, cancelMatching } from '@/services/matchingService';

const WaitingPage: React.FC = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  // 页面加载时获取匹配状态
  useEffect(() => {
    const checkStatus = async () => {
      const status = await getMatchingStatus();
      if (status?.isJoined) {
        setIsJoined(true);
      }
      setLoading(false);
    };
    checkStatus();
  }, []);

  const toggleJoin = async () => {
    if (isJoined) {
      // 取消参与匹配（调用后端 API）
      // TODO: 对接后端取消匹配接口
      // await cancelMatching();
      await cancelMatching();
      setIsJoined(false);
    } else {
      // 参与匹配（调用后端 API）
      await joinMatching();
      setIsJoined(true);
    }
  };

  // 如果正在加载，显示 loading 状态
  if (loading) {
    return (
      <main className="relative pt-32 pb-40 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[921px]">
        <div className="text-on-surface-variant">加载中...</div>
      </main>
    );
  }

  return (
    <main className="relative pt-32 pb-40 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[921px]">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="glow-orb absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-primary-container rounded-full" />
        <div className="glow-orb absolute bottom-[10%] right-[20%] w-[350px] h-[350px] bg-tertiary-container rounded-full" />
      </div>

      {/* Central Glassmorphic Card */}
      <div className="glass-card relative w-full rounded-[4rem] p-12 md:p-20 shadow-[0_32px_64px_-16px_rgba(148,74,0,0.1)] flex flex-col items-center text-center overflow-hidden outline outline-1 outline-white/20">
        {/* 3D Visual */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/15 rounded-full blur-xl animate-pulse" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="material-symbols-outlined text-6xl text-primary leading-none" style={{ fontVariationSettings: '"FILL" 1' }}>
              hourglass_empty
            </span>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-white/50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-secondary animate-spin text-xl">sync</span>
            </div>
          </div>
          <div className="absolute w-44 h-44 border border-primary/10 rounded-full" />
          <div className="absolute w-56 h-56 border border-primary/5 rounded-full" />
        </div>

        {/* Countdown Timer */}
        <div className="flex flex-col items-center mb-10 md:scale-125 transition-transform duration-500 scale-[0.9] sm:scale-100">
          <div className="bg-orange-50/90 backdrop-blur-md border border-orange-200/60 rounded-[2rem] py-4 shadow-[0_12px_32px_-8px_rgba(242,140,56,0.25)] flex items-center space-x-4 px-4 sm:px-8">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>schedule</span>
            <span className="font-headline font-extrabold text-primary tracking-tight whitespace-nowrap">
              距开启还有 <span className="text-2xl sm:text-3xl font-black ml-1 sm:ml-2 tabular-nums">168:00:00</span>
            </span>
          </div>
        </div>

        {/* Typography & Status */}
        <p className="font-body text-body-lg text-on-surface-variant max-w-md leading-relaxed mb-10">
          每周三 12:00 准时揭晓。正在磁场中为你寻找最契合的 TA。
        </p>

        {/* Status Bars Section */}
        <div className="w-full flex flex-col sm:flex-row gap-4 items-stretch justify-center">
          {/* Left: Questionnaire Status */}
          <div className="flex-1 bg-surface-container-low/80 backdrop-blur-sm border border-white/40 rounded-2xl p-4 prism-shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">完成进度</p>
                <p className="font-bold text-on-surface">问卷已完成 100%</p>
              </div>
            </div>
          </div>

          {/* Right: Matching Status */}
          <button onClick={toggleJoin} className="flex-1 active-gradient rounded-2xl p-4 prism-shadow flex items-center justify-between group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>favorite</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">本周参与</p>
                <p className="font-bold text-white">{isJoined ? '已确认参与本次匹配' : '本周未参与匹配'}</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              {isJoined ? (
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-white text-xl group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                  <span className="text-[10px] text-white/80 font-bold uppercase">立即加入</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Secondary Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-12">
        <div className="bg-surface-container-low rounded-[2rem] p-8 flex items-start space-x-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">每周匹配</h3>
            <p className="text-sm text-on-surface-variant leading-snug">每周三 12:00 准时公布新匹配。我们始终坚持品质与契合度高于速度。</p>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-[2rem] p-8 flex items-start space-x-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-primary">verified_user</span>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">真实性保障</h3>
            <p className="text-sm text-on-surface-variant leading-snug">所有参与者均为实名认证学生。在灵魂共鸣中，你的安全与隐私是我们的首要任务。</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WaitingPage;