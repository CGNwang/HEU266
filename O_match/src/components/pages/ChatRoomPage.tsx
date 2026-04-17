import React, { useEffect, useMemo, useState } from 'react';
import { useCountdown } from '@/hooks';
import type { ChatContext, ChatMessageItem, RevealStatus } from '@/services/chatService';
import {
  acceptReveal,
  blockUser,
  getRevealStatus,
  loadMessages,
  rejectReveal,
  reportUser,
  requestReveal,
  resolveChatContext,
  sendContactCard,
  sendMessage,
  subscribeMessages,
} from '@/services/chatService';
import { getEnabledContactMethods } from '@/services/contactMethodsService';

const stageLabelMap: Record<string, string> = {
  undergrad_low: '本科低年级',
  undergrad_high: '本科高年级',
  master: '硕士阶段',
  doctor: '博士阶段',
};

const platformLabelMap: Record<string, string> = {
  wechat: '微信',
  qq: 'QQ',
  douyin: '抖音',
};

const ChatRoomPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [enabledContacts, setEnabledContacts] = useState<Array<{ platform: string; value: string }>>([]);
  const [revealStatus, setRevealStatus] = useState<RevealStatus>('anonymous');
  const [chatContext, setChatContext] = useState<ChatContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');

  const countdown = useCountdown({ initialSeconds: 72 * 3600 });

  const revealStatusText = useMemo(() => {
    if (revealStatus === 'revealed') return '已解盲，可交换联系方式';
    if (revealStatus === 'requested_by_me') return '你已发起解盲申请，等待对方同意';
    if (revealStatus === 'requested_by_partner') return '对方已发起解盲申请';
    if (revealStatus === 'rejected') return '上次申请被拒绝，你可以再次发起';
    return '匿名聊天中';
  }, [revealStatus]);

  useEffect(() => {
    let mounted = true;
    let unsubscribe = () => {};

    const run = async () => {
      setLoading(true);
      const context = await resolveChatContext();
      const [loadedMessages, methods, status] = await Promise.all([
        loadMessages(context.matchId),
        getEnabledContactMethods(),
        getRevealStatus(context.matchId),
      ]);

      if (!mounted) return;

      setChatContext(context);
      setMessages(loadedMessages);
      setEnabledContacts(methods.map((item) => ({ platform: item.platform, value: item.value })));
      setRevealStatus(status);
      setLoading(false);

      unsubscribe = await subscribeMessages(context.matchId, (newMessage) => {
        setMessages((prev) => {
          if (prev.some((item) => item.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
      });
    };

    run();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatContext) return;

    setSending(true);
    setError('');

    const result = await sendMessage(chatContext.matchId, inputValue);
    setSending(false);

    if (!result.success || !result.message) {
      setError(result.error || '发送失败，请稍后重试');
      return;
    }

    setMessages((prev) => [...prev, result.message as ChatMessageItem]);
    setInputValue('');
  };

  const handleRequestReveal = async () => {
    if (!chatContext) return;

    setError('');
    setHint('');

    const result = await requestReveal(chatContext.matchId, chatContext.partnerId ?? undefined);
    if (!result.success || !result.status) {
      setError(result.error || '发起解盲失败');
      return;
    }

    setRevealStatus(result.status);
    setHint('已发起解盲申请，等待对方确认。');
  };

  const handleAcceptReveal = async () => {
    if (!chatContext) return;

    setError('');
    setHint('');

    const result = await acceptReveal(chatContext.matchId);
    if (!result.success || !result.status) {
      setError(result.error || '同意解盲失败');
      return;
    }

    setRevealStatus(result.status);
    setHint('双方已解盲，现在可以交换联系方式。');
  };

  const handleRejectReveal = async () => {
    if (!chatContext) return;

    setError('');
    setHint('');

    const result = await rejectReveal(chatContext.matchId);
    if (!result.success || !result.status) {
      setError(result.error || '拒绝解盲失败');
      return;
    }

    setRevealStatus(result.status);
    setHint('已拒绝本次解盲申请。');
  };

  const handleReportPartner = async () => {
    if (!chatContext) return;

    const reason = window.prompt('请输入举报原因（必填）');
    if (!reason) {
      return;
    }

    const details = window.prompt('补充说明（可选）') || '';
    const result = await reportUser(chatContext.matchId, chatContext.partnerId, { reason, details });

    if (!result.success) {
      setError(result.error || '举报失败');
      return;
    }

    setHint('举报已提交，我们会尽快处理。');
  };

  const handleBlockPartner = async () => {
    if (!chatContext) return;

    const confirmed = window.confirm('确认要拉黑该用户吗？拉黑后将无法继续互发消息。');
    if (!confirmed) {
      return;
    }

    const reason = window.prompt('可填写拉黑原因（可选）') || '';
    const result = await blockUser(chatContext.matchId, chatContext.partnerId, reason);

    if (!result.success) {
      setError(result.error || '拉黑失败');
      return;
    }

    setHint('已拉黑该用户。');
  };

  const handleSendContact = async (platform: string, value: string) => {
    if (!chatContext) return;

    setError('');
    setHint('');

    if (revealStatus !== 'revealed') {
      setError('请先完成双方解盲，再交换联系方式');
      return;
    }

    const confirmed = window.confirm(`确认发送${platformLabelMap[platform] || platform}：${value} 吗？`);
    if (!confirmed) {
      return;
    }

    const result = await sendContactCard(chatContext.matchId, platformLabelMap[platform] || platform, value);
    if (!result.success || !result.message) {
      setError(result.error || '发送失败，请稍后重试');
      return;
    }

    setMessages((prev) => [...prev, result.message as ChatMessageItem]);
    setHint(`${platformLabelMap[platform] || platform} 已发送`);
  };

  return (
    <div className="relative z-10 pt-6 pb-24">
      {/* Match Info Header */}
      <div className="mx-auto w-[92%] max-w-7xl mb-6">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-2xl shadow border-2 border-white">🍊</div>
            <div>
              <div className="font-bold text-on-surface">橘子同学（半匿名）</div>
              <div className="text-xs text-on-surface-variant">
                98% 灵魂契合 · {chatContext?.partnerStage ? (stageLabelMap[chatContext.partnerStage] || chatContext.partnerStage) : '阶段未公开'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full">
              <span className="material-symbols-outlined text-orange-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <span className="text-xs font-bold text-orange-700">{countdown.formatted}</span>
            </div>
            {revealStatus === 'requested_by_partner' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAcceptReveal}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-opacity"
                >
                  同意解盲
                </button>
                <button
                  onClick={handleRejectReveal}
                  className="px-3 py-1.5 text-xs font-bold text-on-surface bg-surface-container rounded-lg hover:opacity-90 transition-opacity"
                >
                  拒绝
                </button>
              </div>
            ) : (
              <button
                onClick={handleRequestReveal}
                disabled={revealStatus === 'requested_by_me' || revealStatus === 'revealed'}
                className="px-3 py-1.5 text-xs font-bold text-primary hover:opacity-80 transition-opacity rounded-lg bg-primary-container/30 disabled:opacity-40"
              >
                {revealStatus === 'revealed' ? '已解盲' : revealStatus === 'requested_by_me' ? '已申请解盲' : '申请解盲'}
              </button>
            )}
            <button
              onClick={handleReportPartner}
              className="px-3 py-1.5 text-xs font-bold text-on-surface hover:opacity-80 transition-opacity rounded-lg bg-surface-container"
            >
              举报
            </button>
            <button
              onClick={handleBlockPartner}
              className="px-3 py-1.5 text-xs font-bold text-error hover:opacity-80 transition-opacity rounded-lg bg-error-container/40"
            >
              拉黑
            </button>
            <button className="px-3 py-1.5 text-xs font-bold text-error hover:opacity-80 transition-opacity rounded-lg hover:bg-error-container">结束匹配</button>
          </div>
          <div className="w-full text-xs text-on-surface-variant">{revealStatusText}</div>
        </div>
      </div>

      {enabledContacts.length > 0 && (
        <div className="mx-auto w-[92%] max-w-7xl mb-4">
          <div className="glass-card rounded-2xl p-4">
            <div className="text-xs font-bold text-on-surface-variant mb-3">快捷交换联系方式（仅解盲后可用）</div>
            <div className="flex flex-wrap gap-2">
              {enabledContacts.map((item) => (
                <button
                  key={item.platform}
                  onClick={() => handleSendContact(item.platform, item.value)}
                  disabled={revealStatus !== 'revealed'}
                  className="px-3 py-2 rounded-full bg-surface-container-low hover:bg-surface-container-lowest text-xs font-bold text-on-surface disabled:opacity-40"
                >
                  发送{platformLabelMap[item.platform] || item.platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="mx-auto w-[92%] max-w-7xl space-y-6 pb-8">
        <div className="flex justify-center">
          <div className="bg-white/50 backdrop-blur-md border border-white/40 px-6 py-2.5 rounded-full text-[10px] font-black text-on-surface-variant/40 tracking-[0.2em] shadow-sm uppercase">
            缘分始于 2 天前
          </div>
        </div>

        {/* Message List */}
        <div className="space-y-8">
          {loading && <div className="text-sm text-on-surface-variant text-center">加载聊天中...</div>}
          {!loading && !chatContext?.partnerId && (
            <div className="text-sm text-on-surface-variant text-center">
              当前未找到有效匹配对象，已进入演示聊天模式。
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-4 max-w-full ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-12 h-12 rounded-[1.25rem] flex-shrink-0 flex items-center justify-center text-2xl shadow-sm border border-white ${msg.sender === 'me' ? 'warm-gradient' : 'bg-primary-fixed'}`}>
                {msg.sender === 'me' ? '👤' : '🍊'}
              </div>
              <div className="space-y-2">
                <div className={`glass-card px-6 py-4 rounded-3xl shadow-sm text-[15px] text-on-surface leading-relaxed ${msg.sender === 'me' ? 'text-white warm-gradient rounded-br-none' : 'rounded-bl-none'} ${msg.type === 'contact_card' ? 'ring-1 ring-orange-300/50' : ''}`}>
                  {msg.type === 'contact_card' && (
                    <div className="text-[11px] uppercase tracking-wider opacity-80 mb-1">联系方式卡片</div>
                  )}
                  {msg.content}
                </div>
                <span className={`text-[11px] text-on-surface-variant/30 ml-2 font-medium ${msg.sender === 'me' ? 'mr-2' : 'ml-2'}`}>{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {hint && <div className="text-green-600 text-sm text-center">{hint}</div>}
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
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !chatContext}
              className="w-12 h-10 rounded-full warm-gradient text-white flex items-center justify-center shadow-md active:scale-95 transition-transform disabled:opacity-40"
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