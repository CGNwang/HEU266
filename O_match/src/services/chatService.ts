import { hasSupabaseConfig, supabase } from '@/lib/supabase';

const LOCAL_CHAT_MESSAGES_KEY = 'stitch_o_match_chat_messages';
const LOCAL_REVEAL_STATUS_KEY = 'stitch_o_match_reveal_status';
const LOCAL_BLOCK_STATUS_KEY = 'stitch_o_match_block_status';

export type ChatSender = 'me' | 'partner';
export type RevealStatus = 'anonymous' | 'requested_by_me' | 'requested_by_partner' | 'revealed' | 'rejected';

export interface ChatMessageItem {
  id: string;
  sender: ChatSender;
  content: string;
  time: string;
  type: 'text' | 'contact_card' | 'system';
}

export interface ChatContext {
  matchId: string;
  partnerId: string | null;
  partnerStage: string | null;
  isDemo: boolean;
}

export interface ReportPayload {
  reason: string;
  details?: string;
}

export interface BlockStatus {
  isBlocked: boolean;
}

const initialMessages: ChatMessageItem[] = [
  {
    id: 'seed_1',
    sender: 'partner',
    content: '嘿！我发现我们都常去图书馆二楼。你通常坐靠窗位置吗？',
    time: '10:24',
    type: 'text',
  },
  {
    id: 'seed_2',
    sender: 'me',
    content: '被你发现了。窗边确实很舒服。',
    time: '10:28',
    type: 'text',
  },
];

const toClock = (dateInput?: string) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const inferType = (content: string): ChatMessageItem['type'] => {
  if (content.startsWith('[联系方式]')) {
    return 'contact_card';
  }
  if (content.startsWith('[系统]')) {
    return 'system';
  }
  return 'text';
};

const readLocalMessages = (): ChatMessageItem[] => {
  const raw = localStorage.getItem(LOCAL_CHAT_MESSAGES_KEY);
  if (!raw) return initialMessages;

  try {
    const parsed = JSON.parse(raw) as ChatMessageItem[];
    return parsed.length ? parsed : initialMessages;
  } catch {
    return initialMessages;
  }
};

const writeLocalMessages = (messages: ChatMessageItem[]) => {
  localStorage.setItem(LOCAL_CHAT_MESSAGES_KEY, JSON.stringify(messages));
};

const readLocalRevealStatus = (): RevealStatus => {
  const raw = localStorage.getItem(LOCAL_REVEAL_STATUS_KEY);
  if (
    raw === 'anonymous' ||
    raw === 'requested_by_me' ||
    raw === 'requested_by_partner' ||
    raw === 'revealed' ||
    raw === 'rejected'
  ) {
    return raw;
  }
  return 'anonymous';
};

const writeLocalRevealStatus = (status: RevealStatus) => {
  localStorage.setItem(LOCAL_REVEAL_STATUS_KEY, status);
};

const readLocalBlockStatus = (matchId: string): boolean => {
  const raw = localStorage.getItem(LOCAL_BLOCK_STATUS_KEY);
  if (!raw) {
    return false;
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return Boolean(parsed[matchId]);
  } catch {
    return false;
  }
};

const writeLocalBlockStatus = (matchId: string, isBlocked: boolean) => {
  const raw = localStorage.getItem(LOCAL_BLOCK_STATUS_KEY);
  let parsed: Record<string, boolean> = {};

  if (raw) {
    try {
      parsed = JSON.parse(raw) as Record<string, boolean>;
    } catch {
      parsed = {};
    }
  }

  if (isBlocked) {
    parsed[matchId] = true;
  } else {
    delete parsed[matchId];
  }

  localStorage.setItem(LOCAL_BLOCK_STATUS_KEY, JSON.stringify(parsed));
};

const getCurrentUser = async () => {
  if (!hasSupabaseConfig || !supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
};

export const resolveChatContext = async (): Promise<ChatContext> => {
  if (!hasSupabaseConfig || !supabase) {
    return {
      matchId: 'demo-match',
      partnerId: null,
      partnerStage: null,
      isDemo: true,
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      matchId: 'demo-match',
      partnerId: null,
      partnerStage: null,
      isDemo: true,
    };
  }

  const { data: matchData, error: matchError } = await supabase
    .from('matches')
    .select('id, user_a_id, user_b_id, status, created_at')
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .in('status', ['matched', 'pending'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (matchError || !matchData) {
    return {
      matchId: 'demo-match',
      partnerId: null,
      partnerStage: null,
      isDemo: true,
    };
  }

  const partnerId = matchData.user_a_id === user.id ? matchData.user_b_id : matchData.user_a_id;
  let partnerStage: string | null = null;

  if (partnerId) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('stage')
      .eq('id', partnerId)
      .maybeSingle();

    partnerStage = (profileData?.stage as string | null | undefined) ?? null;
  }

  return {
    matchId: matchData.id,
    partnerId: partnerId ?? null,
    partnerStage,
    isDemo: false,
  };
};

export const loadMessages = async (matchId: string): Promise<ChatMessageItem[]> => {
  if (!hasSupabaseConfig || !supabase) {
    return readLocalMessages();
  }

  const user = await getCurrentUser();
  if (!user) {
    return readLocalMessages();
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, sender_id, content, created_at')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error || !data) {
    return readLocalMessages();
  }

  const messages = data.map((item) => ({
    id: item.id,
    sender: item.sender_id === user.id ? 'me' : 'partner',
    content: item.content,
    time: toClock(item.created_at),
    type: inferType(item.content),
  })) as ChatMessageItem[];

  writeLocalMessages(messages);
  return messages.length ? messages : initialMessages;
};

export const sendMessage = async (
  matchId: string,
  content: string
): Promise<{ success: boolean; message?: ChatMessageItem; error?: string }> => {
  const clean = content.trim();
  if (!clean) {
    return { success: false, error: '消息不能为空' };
  }

  const localMessage: ChatMessageItem = {
    id: `local_${Date.now()}`,
    sender: 'me',
    content: clean,
    time: toClock(),
    type: inferType(clean),
  };

  if (!hasSupabaseConfig || !supabase) {
    const current = readLocalMessages();
    const next = [...current, localMessage];
    writeLocalMessages(next);
    return { success: true, message: localMessage };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: '登录状态失效，请重新登录' };
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      match_id: matchId,
      sender_id: user.id,
      content: clean,
    })
    .select('id, created_at')
    .single();

  if (error || !data) {
    return { success: false, error: '发送失败，请稍后重试' };
  }

  const remoteMessage: ChatMessageItem = {
    id: data.id,
    sender: 'me',
    content: clean,
    time: toClock(data.created_at),
    type: inferType(clean),
  };

  return { success: true, message: remoteMessage };
};

export const sendContactCard = async (
  matchId: string,
  platformLabel: string,
  value: string
): Promise<{ success: boolean; message?: ChatMessageItem; error?: string }> => {
  return sendMessage(matchId, `[联系方式] ${platformLabel}：${value}`);
};

export const subscribeMessages = async (
  matchId: string,
  onMessage: (message: ChatMessageItem) => void
): Promise<() => void> => {
  if (!hasSupabaseConfig || !supabase) {
    return () => {};
  }

  const client = supabase;

  const user = await getCurrentUser();
  const currentUserId = user?.id;

  const channel = client
    .channel(`chat_messages_${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `match_id=eq.${matchId}`,
      },
      (payload) => {
        const row = payload.new as {
          id: string;
          sender_id: string;
          content: string;
          created_at?: string;
        };

        onMessage({
          id: row.id,
          sender: row.sender_id === currentUserId ? 'me' : 'partner',
          content: row.content,
          time: toClock(row.created_at),
          type: inferType(row.content),
        });
      }
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
};

export const getRevealStatus = async (matchId: string): Promise<RevealStatus> => {
  if (!hasSupabaseConfig || !supabase) {
    return readLocalRevealStatus();
  }

  const user = await getCurrentUser();
  if (!user) {
    return readLocalRevealStatus();
  }

  const { data, error } = await supabase
    .from('identity_reveal_requests')
    .select('requester_id, responder_id, status')
    .eq('match_id', matchId)
    .or(`requester_id.eq.${user.id},responder_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return readLocalRevealStatus();
  }

  if (data.status === 'accepted') {
    writeLocalRevealStatus('revealed');
    return 'revealed';
  }

  if (data.status === 'rejected') {
    writeLocalRevealStatus('rejected');
    return 'rejected';
  }

  const status: RevealStatus = data.requester_id === user.id ? 'requested_by_me' : 'requested_by_partner';
  writeLocalRevealStatus(status);
  return status;
};

export const requestReveal = async (
  matchId: string,
  partnerId?: string
): Promise<{ success: boolean; status?: RevealStatus; error?: string }> => {
  if (!hasSupabaseConfig || !supabase) {
    writeLocalRevealStatus('requested_by_me');
    return { success: true, status: 'requested_by_me' };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: '登录状态失效，请重新登录' };
  }

  if (!partnerId) {
    writeLocalRevealStatus('requested_by_me');
    return { success: true, status: 'requested_by_me' };
  }

  const { error } = await supabase
    .from('identity_reveal_requests')
    .insert({
      match_id: matchId,
      requester_id: user.id,
      responder_id: partnerId,
      status: 'pending',
    });

  if (error) {
    return { success: false, error: '发起解盲失败，请稍后重试' };
  }

  writeLocalRevealStatus('requested_by_me');
  return { success: true, status: 'requested_by_me' };
};

export const acceptRevealForLocalDemo = async (): Promise<RevealStatus> => {
  writeLocalRevealStatus('revealed');
  return 'revealed';
};

export const acceptReveal = async (
  matchId: string
): Promise<{ success: boolean; status?: RevealStatus; error?: string }> => {
  if (!hasSupabaseConfig || !supabase) {
    writeLocalRevealStatus('revealed');
    return { success: true, status: 'revealed' };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: '登录状态失效，请重新登录' };
  }

  const { error } = await supabase
    .from('identity_reveal_requests')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('match_id', matchId)
    .eq('responder_id', user.id)
    .eq('status', 'pending');

  if (error) {
    return { success: false, error: '同意解盲失败，请稍后重试' };
  }

  writeLocalRevealStatus('revealed');
  return { success: true, status: 'revealed' };
};

export const rejectReveal = async (
  matchId: string
): Promise<{ success: boolean; status?: RevealStatus; error?: string }> => {
  if (!hasSupabaseConfig || !supabase) {
    writeLocalRevealStatus('rejected');
    return { success: true, status: 'rejected' };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: '登录状态失效，请重新登录' };
  }

  const { error } = await supabase
    .from('identity_reveal_requests')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .eq('match_id', matchId)
    .eq('responder_id', user.id)
    .eq('status', 'pending');

  if (error) {
    return { success: false, error: '拒绝解盲失败，请稍后重试' };
  }

  writeLocalRevealStatus('rejected');
  return { success: true, status: 'rejected' };
};

export const reportUser = async (
  matchId: string,
  reportedUserId: string | null,
  payload: ReportPayload
): Promise<{ success: boolean; error?: string }> => {
  if (!payload.reason.trim()) {
    return { success: false, error: '请填写举报原因' };
  }

  if (!hasSupabaseConfig || !supabase || !reportedUserId) {
    return { success: true };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: '登录状态失效，请重新登录' };
  }

  const { error } = await supabase.from('chat_reports').insert({
    match_id: matchId,
    reporter_id: user.id,
    reported_user_id: reportedUserId,
    reason: payload.reason.trim(),
    details: (payload.details || '').trim() || null,
  });

  if (error) {
    return { success: false, error: '举报提交失败，请稍后重试' };
  }

  return { success: true };
};

export const blockUser = async (
  matchId: string,
  blockedUserId: string | null,
  reason?: string
): Promise<{ success: boolean; error?: string }> => {
  if (!hasSupabaseConfig || !supabase || !blockedUserId) {
    return { success: true };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: '登录状态失效，请重新登录' };
  }

  const { error } = await supabase.from('chat_blocks').insert({
    match_id: matchId,
    blocker_id: user.id,
    blocked_user_id: blockedUserId,
    reason: (reason || '').trim() || null,
  });

  if (error) {
    return { success: false, error: '拉黑失败，请稍后重试' };
  }

  writeLocalBlockStatus(matchId, true);

  return { success: true };
};

export const unblockUser = async (
  matchId: string,
  blockedUserId: string | null
): Promise<{ success: boolean; error?: string }> => {
  if (!blockedUserId) {
    return { success: false, error: '缺少拉黑对象' };
  }

  if (!hasSupabaseConfig || !supabase) {
    writeLocalBlockStatus(matchId, false);
    return { success: true };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: '登录状态失效，请重新登录' };
  }

  const { error } = await supabase
    .from('chat_blocks')
    .delete()
    .eq('match_id', matchId)
    .eq('blocker_id', user.id)
    .eq('blocked_user_id', blockedUserId);

  if (error) {
    return { success: false, error: '取消拉黑失败，请稍后重试' };
  }

  writeLocalBlockStatus(matchId, false);
  return { success: true };
};

export const getBlockStatus = async (
  matchId: string,
  partnerId: string | null
): Promise<BlockStatus> => {
  if (!partnerId) {
    return { isBlocked: false };
  }

  if (!hasSupabaseConfig || !supabase) {
    return { isBlocked: readLocalBlockStatus(matchId) };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { isBlocked: readLocalBlockStatus(matchId) };
  }

  const { data, error } = await supabase
    .from('chat_blocks')
    .select('id')
    .eq('match_id', matchId)
    .eq('blocker_id', user.id)
    .eq('blocked_user_id', partnerId)
    .maybeSingle();

  if (error) {
    return { isBlocked: readLocalBlockStatus(matchId) };
  }

  const isBlocked = Boolean(data);
  writeLocalBlockStatus(matchId, isBlocked);
  return { isBlocked };
};
