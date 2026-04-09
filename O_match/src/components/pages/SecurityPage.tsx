import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils';

const SecurityPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="pt-12 pb-44 px-4 md:px-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface mb-2">安全设置</h1>
        <p className="text-on-surface-variant font-medium">保护你的账号安全与隐私</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Account Security Section */}
        <div className="glass-card ghost-border rounded-[2rem] p-6 md:p-8 shadow-[0_8px_32px_rgba(28,28,24,0.06)]">
          <h2 className="font-headline text-xl font-bold text-on-surface px-2 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">security</span>
            账号安全
          </h2>
          <div className="space-y-4">
            {/* Change Password */}
            <button
              onClick={() => navigate('/change-password')}
              className="w-full flex items-center p-4 bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-2xl group text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div className="ml-4 flex-1">
                <div className="text-on-surface font-bold">修改密码</div>
                <div className="text-on-surface-variant text-sm">先验证校园邮箱，再进入密码重设</div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>

            {/* Change Email */}
            <button className="w-full flex items-center p-4 bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-2xl group text-left">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div className="ml-4 flex-1">
                <div className="text-on-surface font-bold">更换邮箱</div>
                <div className="text-on-surface-variant text-sm">更改绑定邮箱地址</div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>

            {/* Bind Phone */}
            <button className="w-full flex items-center p-4 bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-2xl group text-left">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">smartphone</span>
              </div>
              <div className="ml-4 flex-1">
                <div className="text-on-surface font-bold">绑定手机</div>
                <div className="text-on-surface-variant text-sm">用于找回密码与通知</div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>

            {/* Bind WeChat */}
            <button className="w-full flex items-center p-4 bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-2xl group text-left">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>chat_bubble</span>
              </div>
              <div className="ml-4 flex-1">
                <div className="text-on-surface font-bold">绑定微信</div>
                <div className="text-on-surface-variant text-sm">用于匹配成功后联系</div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="glass-card ghost-border rounded-[2rem] p-6 md:p-8 shadow-[0_8px_32px_rgba(28,28,24,0.06)] border border-error/20">
          <h2 className="font-headline text-xl font-bold text-error px-2 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-error">warning</span>
            危险操作
          </h2>
          <div className="space-y-4">
            {/* Delete Account */}
            <button className="w-full flex items-center p-4 bg-error-container/30 hover:bg-error-container/50 transition-all duration-300 rounded-2xl group text-left">
              <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">delete_forever</span>
              </div>
              <div className="ml-4 flex-1">
                <div className="text-on-surface font-bold text-error">注销账号</div>
                <div className="text-on-surface-variant text-sm">永久删除账号与所有数据</div>
              </div>
              <span className="material-symbols-outlined text-error group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 px-8 py-4 bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-full text-on-surface-variant font-bold"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          返回个人资料
        </button>
      </div>
    </main>
  );
};

export default SecurityPage;
