import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EmailVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSendCode = () => {
    // TODO: 调用发送验证码 API
    navigate('/register');
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen relative selection:bg-primary-fixed selection:text-primary-fixed overflow-y-auto">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] warm-glow rounded-full pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[600px] h-[600px] warm-glow rounded-full pointer-events-none opacity-60" />

      {/* Main Content Wrapper */}
      <div className="min-h-screen w-full flex flex-col items-center py-12 md:py-16 relative z-10 px-6">
        {/* Branding */}
        <div className="mb-12 md:mb-16">
          <div className="text-3xl font-black text-orange-700 tracking-tighter flex items-center gap-2 pointer-events-auto">
            <Link to="/" className="flex items-center gap-1">
              <span>🍊</span>
              <span>意配</span>
            </Link>
          </div>
        </div>

        {/* Auth Canvas */}
        <main className="w-full max-w-lg flex-1 flex flex-col justify-center">
          {/* Central Floating Card */}
          <div className="glass-card ghost-border rounded-[2rem] p-10 md:p-12 shadow-[0_8px_32px_rgba(28,28,24,0.06)] flex flex-col items-center text-center">
            {/* Icon/Shield Visual */}
            <div className="w-20 h-20 sunset-gradient rounded-full flex items-center justify-center mb-8 shadow-lg shadow-orange-500/20">
              <span className="material-symbols-outlined text-white text-4xl">verified_user</span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-3xl font-bold font-headline text-on-surface tracking-tight mb-4">校园身份认证</h1>
            <p className="text-on-surface-variant leading-relaxed mb-10 max-w-xs">为了保持社交环境的纯粹，请使用 HEU 校园邮箱认证</p>

            {/* Form */}
            <form className="w-full space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-4" htmlFor="email">
                  HEU 校园邮箱
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-on-surface placeholder:text-outline/40 focus:ring-0 focus:bg-surface-container-lowest transition-all duration-300 ghost-border"
                    id="email"
                    placeholder="name@hrbeu.edu.cn"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="material-symbols-outlined text-outline/30">alternate_email</span>
                  </div>
                </div>
              </div>

              {/* Verification Code Action */}
              <button
                type="button"
                onClick={handleSendCode}
                className="w-full sunset-gradient text-white font-bold py-5 rounded-full shadow-lg shadow-orange-700/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>发送验证码</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>

            {/* Privacy Policy & Trust Tags */}
            <div className="mt-10 pt-8 border-t border-orange-100/30 w-full">
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-fixed rounded-full text-on-secondary-fixed-variant text-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  隐私加密保护
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high rounded-full text-on-surface-variant text-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility_off</span>
                  完全匿名策略
                </div>
              </div>
              <p className="text-[12px] text-on-surface-variant/60 leading-relaxed px-4">
                您的个人信息仅用于验证哈工程学生身份，系统将对您的真实姓名进行混淆脱敏。认证完成后，您将正式解锁「🍊意配」所有心动功能。
              </p>
            </div>
          </div>

          {/* Secondary Action */}
          <div className="mt-12 text-center">
            <button className="text-on-surface-variant hover:text-primary font-medium text-sm transition-colors flex items-center justify-center gap-1 mx-auto">
              遇到问题？联系管理员
              <span className="material-symbols-outlined text-[16px]">help_outline</span>
            </button>
          </div>
        </main>
      </div>

      {/* Bottom Aesthetic Glow */}
      <div className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none -z-10">
        <div className="w-full h-full opacity-30 blur-[80px] bg-gradient-to-t from-orange-400 to-transparent" />
      </div>
    </div>
  );
};

export default EmailVerifyPage;