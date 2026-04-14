import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  defaultNotificationSettings,
  loadNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings,
} from '@/services/notificationSettingsService';

const NotificationSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = React.useState<NotificationSettings>(defaultNotificationSettings);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [hint, setHint] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const next = await loadNotificationSettings();
      if (cancelled) return;
      setSettings(next);
      setLoading(false);
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = async (next: NotificationSettings) => {
    setSaving(true);
    setError('');
    setSettings(next);

    const result = await saveNotificationSettings(next);
    if (result.success) {
      setHint('设置已保存并同步到云端');
      window.setTimeout(() => setHint(''), 1200);
    } else {
      setError(result.message || '保存失败，请稍后重试');
    }

    setSaving(false);
  };

  const toggle = (key: keyof NotificationSettings) => {
    void updateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  if (loading) {
    return (
      <main className="pt-32 pb-44 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="glass-card ghost-border rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(28,28,24,0.06)] text-center text-on-surface-variant">
          正在加载通知设置...
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-44 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="glass-card ghost-border rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(28,28,24,0.06)] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/20 blur-[80px] rounded-full" />

        <div className="relative">
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface mb-3">通知提醒</h1>
          <p className="text-on-surface-variant mb-8">你可以在这里管理匹配相关提醒开关</p>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => toggle('halfHourCountdownReminder')}
              disabled={saving}
              className="w-full flex items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-[1.5rem] text-left"
            >
              <div>
                <div className="text-on-surface font-bold">匹配结果半小时倒计时提醒</div>
                <div className="text-on-surface-variant text-sm mt-1">在匹配结果发布前 30 分钟提醒你</div>
              </div>
              <span className={`inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.halfHourCountdownReminder ? 'bg-primary' : 'bg-outline-variant/60'}`}>
                <span className={`h-5 w-5 rounded-full bg-white transition-transform ${settings.halfHourCountdownReminder ? 'translate-x-6' : 'translate-x-1'}`} />
              </span>
            </button>

            <button
              type="button"
              onClick={() => toggle('matchResultReminder')}
              disabled={saving}
              className="w-full flex items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-[1.5rem] text-left"
            >
              <div>
                <div className="text-on-surface font-bold">匹配结果提醒</div>
                <div className="text-on-surface-variant text-sm mt-1">在本周匹配结果生成后通知你</div>
              </div>
              <span className={`inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.matchResultReminder ? 'bg-primary' : 'bg-outline-variant/60'}`}>
                <span className={`h-5 w-5 rounded-full bg-white transition-transform ${settings.matchResultReminder ? 'translate-x-6' : 'translate-x-1'}`} />
              </span>
            </button>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-8 py-4 bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-full text-on-surface-variant font-bold"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              返回个人资料
            </button>
          </div>
          {hint && <div className="mt-3 text-sm text-green-600 text-center font-medium">{hint}</div>}
          {error && <div className="mt-3 text-sm text-red-500">{error}</div>}
        </div>
      </div>
    </main>
  );
};

export default NotificationSettingsPage;
