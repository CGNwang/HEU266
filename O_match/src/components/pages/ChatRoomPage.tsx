import React, { useState } from 'react';
import { useCountdown } from '@/hooks';

const ChatRoomPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'partner', content: '嘿！我发现我们都常去图书馆二楼。你通常是坐在靠窗的那个位置吗？', time: '10:24 AM' },
    { id: 2, sender: 'me', content: '被发现了！😅 窗边的位置视野最好，学习累了看窗外特别解压。你现在在那儿吗？', time: '10:28 AM' },
    { id: 3, sender: 'partner', content: '今天不在呢，不幸被困在一个 3 小时的研讨会里。简直是酷刑。', time: '10:30 AM' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const countdown = useCountdown({ initialSeconds: 72 * 3600 });

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'me', content: inputValue, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
    setInputValue('');
  };

  return (
    <div className="relative z-10 pt-6 pb-24">
      {/* Match Info Header */}
      <div className="mx-auto w-[92%] max-w-7xl mb-6">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-2xl shadow border-2 border-white">🍊</div>
            <div>
              <div className="font-bold text-on-surface">Orange</div>
              <div className="text-xs text-on-surface-variant">98% 灵魂契合</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full">
              <span className="material-symbols-outlined text-orange-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <span className="text-xs font-bold text-orange-700">{countdown.formatted}</span>
            </div>
            <button className="px-3 py-1.5 text-xs font-bold text-error hover:opacity-80 transition-opacity rounded-lg hover:bg-error-container">结束匹配</button>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="mx-auto w-[92%] max-w-7xl space-y-6 pb-8">
        <div className="flex justify-center">
          <div className="bg-white/50 backdrop-blur-md border border-white/40 px-6 py-2.5 rounded-full text-[10px] font-black text-on-surface-variant/40 tracking-[0.2em] shadow-sm uppercase">
            缘分始于 2 天前
          </div>
        </div>

        {/* Message List */}
        <div className="space-y-12">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-4 max-w-full ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-12 h-12 rounded-[1.25rem] flex-shrink-0 flex items-center justify-center text-2xl shadow-sm border border-white ${msg.sender === 'me' ? 'warm-gradient' : 'bg-primary-fixed'}`}>
                {msg.sender === 'me' ? '👤' : '🍊'}
              </div>
              <div className="space-y-2">
                <div className={`glass-card px-6 py-4 rounded-3xl shadow-sm text-[15px] text-on-surface leading-relaxed ${msg.sender === 'me' ? 'text-white warm-gradient rounded-br-none' : 'rounded-bl-none'}`}>
                  {msg.content}
                </div>
                <span className={`text-[11px] text-on-surface-variant/30 ml-2 font-medium ${msg.sender === 'me' ? 'mr-2' : 'ml-2'}`}>{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="fixed bottom-0 left-0 right-0 px-4 md:px-0 pb-6 pt-4 bg-gradient-to-t from-[#fdf9f3] via-[#fdf9f3]/90 to-transparent z-50">
        <div className="mx-auto w-[92%] max-w-7xl">
          <div className="glass-card rounded-[2.5rem] p-2 shadow-lg flex items-center gap-2 border-white/70">
            <div className="flex items-center gap-1 pl-2">
              <button className="w-10 h-10 rounded-full hover:bg-white/80 transition-colors text-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">add_circle</span>
              </button>
              <button className="w-10 h-10 rounded-full hover:bg-white/80 transition-colors text-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">sentiment_satisfied</span>
              </button>
            </div>
            <input
              className="flex-1 bg-transparent border-none rounded-2xl px-3 py-3 text-base focus:ring-0 placeholder:text-on-surface-variant/30 font-medium"
              placeholder="回复 Orange..."
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="w-12 h-10 rounded-full warm-gradient text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>
      </div>
      <div className="h-4 md:hidden" />
    </div>
  );
};

export default ChatRoomPage;