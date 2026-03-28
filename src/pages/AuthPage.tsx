import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, ArrowRight, Lock, EyeOff, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/survey');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center relative px-6">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-container/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-primary-container/10 blur-[100px] rounded-full pointer-events-none opacity-60"></div>

      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/60 backdrop-blur-3xl border border-outline-variant/20 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(28,28,24,0.06)] flex flex-col items-center text-center">
          <div className="w-20 h-20 orange-glow rounded-full flex items-center justify-center mb-8 shadow-lg shadow-primary-container/20">
            <ShieldCheck className="text-white" size={40} />
          </div>

          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-4">校园身份认证</h1>
          <p className="text-on-surface-variant leading-relaxed mb-10 max-w-xs">为了保持社交环境的纯粹，请使用 HEU 校园邮箱认证</p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-4" htmlFor="email">
                HEU 校园邮箱
              </label>
              <div className="relative group">
                <input 
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary-container/20 focus:bg-white transition-all duration-300 outline outline-1 outline-outline-variant/10" 
                  id="email" 
                  placeholder="yourname@hrbeu.edu.cn" 
                  type="email"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/30">
                  <Mail size={20} />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full orange-glow text-white font-bold py-5 rounded-full shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span>发送验证码</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-outline-variant/10 w-full">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-fixed rounded-full text-secondary text-xs font-semibold">
                <Lock size={14} fill="currentColor" />
                隐私加密保护
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high rounded-full text-on-surface-variant text-xs font-semibold">
                <EyeOff size={14} fill="currentColor" />
                完全匿名策略
              </div>
            </div>
            <p className="text-[12px] text-on-surface-variant/60 leading-relaxed px-4">
              您的个人信息仅用于验证哈工程学生身份，系统将对您的真实姓名进行混淆脱敏。认证完成后，您将正式解锁「🍊意配」所有心动功能。
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="text-on-surface-variant hover:text-primary font-medium text-sm transition-colors flex items-center justify-center gap-1 mx-auto">
            遇到问题？联系管理员
            <HelpCircle size={16} />
          </button>
        </div>
      </motion.main>
    </div>
  );
}
