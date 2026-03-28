import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserCircle2, Users2, ArrowRight, Undo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SurveyPage() {
  const navigate = useNavigate();
  const [value, setValue] = useState(70);

  const handleNext = () => {
    navigate('/report');
  };

  return (
    <div className="relative z-10 pt-20 pb-40 px-6 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center">
      {/* Progress Bar */}
      <div className="fixed top-[100px] left-1/2 -translate-x-1/2 w-[80%] max-w-2xl z-40">
        <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "65%" }}
            className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full shadow-[0_0_12px_rgba(246,138,47,0.4)]"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Step 12 of 18</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">65% Completed</span>
        </div>
      </div>

      <div className="w-full space-y-12">
        <div className="text-center space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed text-secondary text-xs font-bold tracking-widest uppercase"
          >
            性格维度 - 大五人格
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight"
          >
            在社交活动中，<br />你通常如何寻找能量？
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant/80 max-w-lg mx-auto leading-relaxed"
          >
            这项指标将帮助我们分析你的 <span className="text-primary font-bold">外向性 (Extraversion)</span> 指数，为你匹配互补或共鸣的灵魂。
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(28,28,24,0.08)] outline outline-1 outline-white/40"
        >
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-right">
                <div className="w-16 h-16 mx-auto md:ml-auto mb-4 bg-surface-container-low rounded-2xl flex items-center justify-center text-on-surface-variant">
                  <UserCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2">独处充电</h3>
                <p className="text-sm text-on-surface-variant">安静的环境让我感到放松和恢复活力</p>
              </div>

              <div className="w-full md:w-1/2 flex flex-col items-center gap-6">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={value}
                  onChange={(e) => setValue(parseInt(e.target.value))}
                  className="w-full h-1 bg-outline-variant rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between w-full px-2">
                  {[...Array(9)].map((_, i) => (
                    <span key={i} className={`w-0.5 rounded-full bg-outline-variant/40 ${i % 2 === 0 ? 'h-4' : 'h-2'}`} />
                  ))}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="w-16 h-16 mx-auto md:mr-auto mb-4 bg-primary-fixed rounded-2xl flex items-center justify-center text-primary">
                  <Users2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2">社交共鸣</h3>
                <p className="text-sm text-on-surface-variant">与他人交流互动让我感到精神振奋</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-6 rounded-2xl flex items-center justify-between group hover:bg-surface-container-high transition-all">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-primary tracking-widest uppercase">维度权重</p>
                  <p className="text-lg font-bold text-on-surface">我非常看重这一点</p>
                </div>
                <div className="w-14 h-8 bg-primary rounded-full relative p-1 cursor-pointer">
                  <div className="w-6 h-6 bg-white rounded-full absolute right-1" />
                </div>
              </div>
              <div className="bg-surface-container-low p-6 rounded-2xl flex items-center gap-6 hover:bg-surface-container-high transition-all">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">优先等级</span>
                    <span className="text-xs font-bold text-primary">高</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-12 left-0 right-0 z-40 flex flex-col items-center gap-6">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="group relative px-12 py-5 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-bold text-lg shadow-[0_20px_40px_-8px_rgba(148,74,0,0.4)] flex items-center gap-3"
        >
          <span>下一题</span>
          <ArrowRight size={20} />
        </motion.button>
        <button className="text-on-surface-variant/60 text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
          <Undo2 size={16} />
          <span>返回上一题</span>
        </button>
      </div>
    </div>
  );
}
