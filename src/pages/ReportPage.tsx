import React from 'react';
import { motion } from 'motion/react';
import { Clock, Moon, BookOpen, Utensils, ChevronRight, Hourglass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReportPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12 pb-32">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center py-16 px-8 rounded-[3rem] overflow-hidden bg-surface-container-low"
      >
        <div className="relative z-10 space-y-4">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm">Matching Report</span>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-on-surface">
            契合度 <span className="text-transparent bg-clip-text orange-glow">98%</span>
          </h1>
          
          <div className="w-full max-w-md mx-auto pt-8">
            <div className="relative h-24 w-full">
              <svg className="w-full h-full text-surface-container-highest stroke-outline-variant fill-none" viewBox="0 0 400 100">
                <path d="M0,100 Q100,100 200,10 T300,100 T400,100" strokeWidth="2" />
                <circle className="fill-primary" cx="215" cy="22" r="6" />
                <text className="text-[10px] font-bold fill-primary" x="230" y="25">YOU</text>
              </svg>
              <p className="mt-2 text-sm text-on-surface-variant italic">
                恭喜！你们的契合度击败了全校 99.4% 的校友组合
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Soul Radar & Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Radar Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-7 bg-white/60 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between"
        >
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">灵魂雷达图</h3>
            <p className="text-on-surface-variant text-sm mb-8">基于大五人格与生活轨迹的深度重合度分析</p>
          </div>
          <div className="relative aspect-square w-full max-w-[300px] mx-auto flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100">
              <polygon className="fill-primary/10 stroke-primary stroke-[1.5]" points="50,10 85,35 75,85 25,85 15,35" />
              <text className="text-[6px] font-bold fill-on-surface" textAnchor="middle" x="50" y="5">开放性</text>
              <text className="text-[6px] font-bold fill-on-surface" textAnchor="start" x="95" y="35">责任感</text>
              <text className="text-[6px] font-bold fill-on-surface" textAnchor="middle" x="80" y="92">宜人性</text>
              <text className="text-[6px] font-bold fill-on-surface" textAnchor="middle" x="20" y="92">神经质</text>
              <text className="text-[6px] font-bold fill-on-surface" textAnchor="end" x="5" y="35">外向性</text>
            </svg>
          </div>
        </motion.div>

        {/* Identity Preview Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-5 flex flex-col gap-6"
        >
          <div className="flex-1 bg-surface-container-highest rounded-3xl p-6 relative overflow-hidden group">
            <img 
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-700" 
              src="https://picsum.photos/seed/dream/600/800"
              alt="Dream Match"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end text-white">
              <span className="text-xs font-bold tracking-widest opacity-80 mb-1">DREAM MATCH</span>
              <h4 className="text-2xl font-bold">哈工程「匿名」校友</h4>
              <p className="text-sm opacity-90">TA 也填写了“深海领航”志愿</p>
            </div>
          </div>
          <div className="bg-secondary-fixed text-secondary p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Clock size={20} />
              <span className="text-sm font-bold">匹配时效</span>
            </div>
            <div className="text-4xl font-black tracking-tighter">71:59:42</div>
            <p className="text-xs mt-2 opacity-80">缘分转瞬即逝，请在 3 天内开启首聊</p>
          </div>
        </motion.div>
      </div>

      {/* Resonance Points */}
      <section className="space-y-6">
        <h3 className="text-3xl font-bold tracking-tight px-2">共鸣时刻</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[2.5rem] bg-surface-container-low space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              <Moon size={24} />
            </div>
            <h5 className="text-lg font-bold">深夜思想家</h5>
            <p className="text-on-surface-variant text-sm leading-relaxed">你们都勾选了“凌晨 2 点是灵感巅峰”，比起喧嚣的社交，更喜欢独处的静谧。</p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-surface-container-low space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <BookOpen size={24} />
            </div>
            <h5 className="text-lg font-bold">纸质书信徒</h5>
            <p className="text-on-surface-variant text-sm leading-relaxed">都喜欢在学校 11 号楼的窗边阅读，且坚持认为纸张的触感无可替代。</p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-surface-container-low space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed-dim flex items-center justify-center text-primary">
              <Utensils size={24} />
            </div>
            <h5 className="text-lg font-bold">麻辣拌狂热</h5>
            <p className="text-on-surface-variant text-sm leading-relaxed">在饮食倾向中，你们不约而同地把“加醋的麻辣拌”排到了第一位。</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center py-12 gap-4">
        <Link to="/chat" className="w-full max-w-md">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 orange-glow text-white text-lg font-bold rounded-full shadow-[0_8px_32px_rgba(148,74,0,0.3)]"
          >
            开启 72 小时限时聊天
          </motion.button>
        </Link>
        <button className="w-full max-w-md py-5 bg-surface-container-high text-primary text-lg font-bold rounded-full hover:bg-surface-variant transition-colors">
          看看对方的问卷共性
        </button>
      </section>

      {/* Next State */}
      <section className="mt-16 py-8 border-t border-outline-variant/20">
        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:bg-white/60 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center text-on-surface-variant">
              <Hourglass size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">想要更多可能？</p>
              <p className="text-xs text-on-surface-variant">宁缺毋滥，下周日 20:00 准时开奖</p>
            </div>
          </div>
          <ChevronRight className="text-on-surface-variant" size={20} />
        </div>
      </section>
    </div>
  );
}
