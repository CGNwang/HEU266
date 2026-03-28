import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Archive, BarChart3, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="relative z-10 pt-12 pb-32">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 text-center mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed/50 text-primary text-xs font-bold mb-8 outline outline-1 outline-outline-variant/30"
        >
          <Sparkles size={14} />
          HEU 专属社交实验
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface mb-8 leading-[1.1]"
        >
          遇见 HEU <br />
          <span className="text-transparent bg-clip-text orange-glow">懂你的灵魂</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-medium"
        >
          在工科的世界里，用数据为你精准匹配那颗独一无二的灵魂。拒绝无效社交，让缘分在哈工程的校园里自然生长。
        </motion.p>
      </section>

      {/* Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: 慢社交 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-surface-container-low p-10 rounded-3xl flex flex-col gap-6 group hover:bg-surface-container transition-all duration-500"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
            <Archive size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-on-surface mb-3">慢社交</h3>
            <p className="text-on-surface-variant leading-relaxed">拒绝快餐式交友，每周一次精心筛选的灵魂盲盒。在快节奏的大学生活里，我们为你按下暂停键。</p>
          </div>
          <div className="mt-auto pt-4 overflow-hidden rounded-2xl h-40">
            <img 
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105" 
              src="https://picsum.photos/seed/letter/600/400" 
              alt="Slow social"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Card 2: 数据化浪漫 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-surface-container-highest p-10 rounded-3xl flex flex-col gap-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed-dim flex items-center justify-center text-primary">
            <BarChart3 size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-on-surface mb-3">数据化浪漫</h3>
            <p className="text-on-surface-variant leading-relaxed">基于 32 个维度的心理学建模与 MBTI 契合度雷达。让感性的相遇，拥有理性的共鸣基础。</p>
          </div>
          <div className="mt-auto bg-white/40 backdrop-blur-md rounded-2xl p-6 outline outline-1 outline-outline-variant/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-primary">灵魂契合度指数</span>
              <span className="text-lg font-black text-primary">98.2%</span>
            </div>
            <div className="space-y-3">
              <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full orange-glow w-[92%] rounded-full"></div>
              </div>
              <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full orange-glow w-[85%] rounded-full"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 3: 纯粹校园 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-surface-container-low p-10 rounded-3xl flex flex-col gap-6 group hover:bg-surface-container transition-all duration-500"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-on-surface mb-3">纯粹校园</h3>
            <p className="text-on-surface-variant leading-relaxed">仅限 HEU 校园邮箱认证，严格杜绝社会人士。这里只有最纯粹的学子情谊与工程大回忆。</p>
          </div>
          <div className="mt-auto pt-4 flex -space-x-4">
            {[1, 2].map((i) => (
              <div key={i} className="w-16 h-16 rounded-full border-4 border-surface overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src={`https://picsum.photos/seed/student${i}/200/200`} 
                  alt="Student"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
            <div className="w-16 h-16 rounded-full border-4 border-surface flex items-center justify-center bg-primary-container text-white font-bold text-xs">+12k</div>
          </div>
        </motion.div>
      </section>

      {/* Floating CTA */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60]">
        <Link to="/auth">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="orange-glow text-white px-8 py-5 rounded-full flex items-center gap-3 font-bold text-lg shadow-[0_8px_32px_rgba(148,74,0,0.25)]"
          >
            <Heart size={20} fill="currentColor" />
            开启我的灵魂盲盒
          </motion.button>
        </Link>
      </div>

      {/* Decoration */}
      <div className="absolute top-[20%] -left-64 w-[600px] h-[600px] bg-primary-fixed/20 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute top-[60%] -right-64 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full -z-10"></div>
    </div>
  );
}
