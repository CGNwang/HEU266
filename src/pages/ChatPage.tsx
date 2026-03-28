import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Lock, Library, Coffee, Palette, ShieldCheck, MoreHorizontal, Send, PlusCircle, Smile, BarChart3 } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      {/* AI Strategist Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 border-r border-outline-variant/10 bg-white/40 backdrop-blur-3xl z-20 overflow-y-auto custom-scrollbar">
        <div className="px-6 py-8">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-2xl orange-glow flex items-center justify-center text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface tracking-tight leading-none">AI 恋爱军师</h2>
              <p className="text-[10px] text-on-surface-variant/60 font-medium mt-1 uppercase tracking-wider">Love Strategist</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Premium AI Strategist Section */}
            <section>
              <div className="bg-on-surface p-5 rounded-3xl shadow-xl relative overflow-hidden group border border-white/10">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-primary-fixed" size={16} />
                    <span className="text-[10px] font-black text-primary-fixed uppercase tracking-[0.2em]">深度智囊</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">解锁私人恋爱智囊</h4>
                  <p className="text-[11px] text-white/60 leading-relaxed mb-4">获取针对当前对话的实时回复建议与专属约会方案，像专家一样交流。</p>
                  <button className="w-full py-2.5 bg-primary-fixed text-primary text-[11px] font-black rounded-xl hover:bg-white transition-all shadow-sm flex items-center justify-center gap-2">
                    <span>捐赠支持项目以解锁</span>
                    <Lock size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* Icebreaker Cards */}
            <section>
              <h3 className="text-[11px] font-extrabold text-on-surface-variant/40 tracking-widest uppercase mb-4 px-1">基础破冰话题卡</h3>
              <div className="space-y-3">
                {[
                  { icon: <Library size={14} />, title: '共同点：哈工程图书馆', text: '聊聊图书馆里那个只有你发现的安静角落？' },
                  { icon: <Coffee size={14} />, title: '共同点：精品咖啡', text: '比起燕麦拿铁，你更偏爱哪种产区的豆子？' },
                  { icon: <Palette size={14} />, title: '共同点：建筑审美', text: '如果你可以重新设计校园里的一个角落...' },
                ].map((card, i) => (
                  <div key={i} className="bg-white/50 backdrop-blur-md border border-white/40 p-4 rounded-[1.5rem] cursor-pointer hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      {card.icon}
                      <span className="text-[9px] font-bold uppercase tracking-wider">{card.title}</span>
                    </div>
                    <p className="text-[12px] text-on-surface leading-snug font-medium">{card.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <div className="mt-auto p-6 border-t border-outline-variant/5">
          <div className="flex items-center gap-3 text-on-surface-variant/40">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-medium">Orange AI 智能加密保障</span>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-surface">
        {/* Chat Header */}
        <header className="flex justify-between items-center px-8 w-full h-20 sticky top-0 z-50 bg-white/30 backdrop-blur-2xl border-b border-white/20">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-on-surface tracking-tight">Orange 🍊</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-fixed/50 text-[10px] font-bold text-primary border border-primary-fixed-dim/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              98% 灵魂契合
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[12px] font-bold text-on-surface-variant/60 hover:text-primary transition-colors">举报</button>
            <button className="text-[12px] font-bold text-error hover:opacity-80 transition-opacity">结束匹配</button>
            <div className="h-6 w-px bg-outline-variant/20"></div>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors">
              <MoreHorizontal className="text-on-surface-variant" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar pb-36">
          <div className="flex justify-center">
            <div className="bg-white/50 backdrop-blur-md border border-white/40 px-6 py-2 rounded-full text-[10px] font-black text-on-surface-variant/40 tracking-[0.2em] shadow-sm uppercase">
              缘分始于 2 天前
            </div>
          </div>

          {/* Left Message */}
          <div className="flex items-end gap-5 max-w-[70%]">
            <div className="w-12 h-12 rounded-[1.25rem] bg-primary-fixed flex-shrink-0 flex items-center justify-center text-2xl shadow-sm border border-white">🍊</div>
            <div className="space-y-2">
              <div className="bg-white/60 backdrop-blur-3xl border border-white/40 px-6 py-4 rounded-3xl rounded-bl-none shadow-sm text-[14px] text-on-surface leading-relaxed">
                嘿！我发现我们都常去图书馆二楼。你通常是坐在靠窗的那个位置吗？
              </div>
              <span className="text-[10px] text-on-surface-variant/30 ml-1 font-medium">10:24 AM</span>
            </div>
          </div>

          {/* Right Message */}
          <div className="flex flex-row-reverse items-end gap-5 max-w-[70%] ml-auto">
            <div className="w-12 h-12 rounded-[1.25rem] orange-glow flex-shrink-0 flex items-center justify-center text-white text-xl shadow-lg border border-white/20">👤</div>
            <div className="space-y-2 text-right">
              <div className="orange-glow px-6 py-4 rounded-3xl rounded-br-none shadow-xl shadow-primary/10 text-[14px] text-white leading-relaxed text-left">
                被发现了！😅 窗边的位置视野最好，学习累了看窗外特别解压。你现在在那儿吗？
              </div>
              <div className="flex items-center justify-end gap-1.5 text-[10px] text-on-surface-variant/30 font-medium">
                <span>10:28 AM</span>
              </div>
            </div>
          </div>

          {/* Left Message */}
          <div className="flex items-end gap-5 max-w-[70%]">
            <div className="w-12 h-12 rounded-[1.25rem] bg-primary-fixed flex-shrink-0 flex items-center justify-center text-2xl shadow-sm border border-white">🍊</div>
            <div className="space-y-2">
              <div className="bg-white/60 backdrop-blur-3xl border border-white/40 px-6 py-4 rounded-3xl rounded-bl-none shadow-sm text-[14px] text-on-surface leading-relaxed">
                今天不在呢，不幸被困在一个 3 小时的研讨会里。简直是酷刑。
              </div>
              <span className="text-[10px] text-on-surface-variant/30 ml-1 font-medium">10:30 AM</span>
            </div>
          </div>
        </div>

        {/* Floating Input */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-6rem)] max-w-2xl z-40">
          <div className="bg-white/60 backdrop-blur-3xl border border-white/70 rounded-[2.5rem] p-2.5 shadow-2xl flex items-center gap-2">
            <div className="flex items-center gap-1 pl-2">
              <button className="w-10 h-10 rounded-full hover:bg-white/80 transition-colors text-on-surface-variant/60 flex items-center justify-center">
                <PlusCircle size={20} />
              </button>
              <button className="w-10 h-10 rounded-full hover:bg-white/80 transition-colors text-on-surface-variant/60 flex items-center justify-center">
                <Smile size={20} />
              </button>
            </div>
            <input 
              className="flex-1 bg-transparent border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-0 placeholder:text-on-surface-variant/30 font-medium" 
              placeholder="回复 Orange..." 
              type="text"
            />
            <button className="w-14 h-11 rounded-full orange-glow text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform mr-1">
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Profile Sidebar */}
      <aside className="hidden xl:flex flex-col w-80 bg-white/30 backdrop-blur-3xl p-8 gap-8 h-full border-l border-outline-variant/5 overflow-y-auto custom-scrollbar">
        <div className="text-center space-y-5">
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-3xl bg-primary-fixed flex items-center justify-center text-6xl shadow-2xl border-4 border-white">🍊</div>
            <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-surface"></div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-on-surface tracking-tight">Orange</h2>
            <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mt-1">代号：橙色频率</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/50 rounded-[2rem] p-6 border border-white/60">
            <h3 className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mb-6">性格指标对比</h3>
            <div className="space-y-6">
              {[
                { label: '外向性', value: 78, status: '高度重合' },
                { label: '开放性', value: 90, status: '共振 92%' },
              ].map((metric) => (
                <div key={metric.label} className="space-y-2.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-on-surface-variant/60 tracking-wider">
                    <span>{metric.label}</span>
                    <span className="text-primary">{metric.status}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${metric.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/50 rounded-[2rem] p-6 border border-white/60">
            <h3 className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mb-4">灵魂共鸣点</h3>
            <div className="flex flex-wrap gap-2">
              {['独立音乐爱好者', '建筑美学', '深夜哲学'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-primary-fixed/40 text-primary text-[10px] font-bold rounded-xl border border-primary-fixed-dim/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <button className="w-full py-4 rounded-2xl bg-on-surface text-white text-[11px] font-black hover:bg-on-surface-variant transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] shadow-lg">
            <BarChart3 size={16} />
            查看详细报告
          </button>
        </div>
      </aside>
    </div>
  );
}
