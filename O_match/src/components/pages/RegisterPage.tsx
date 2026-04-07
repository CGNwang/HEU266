import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '@/services/authService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证密码
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    setLoading(true);

    try {
      // 使用邮箱前缀作为用户名
      const username = email.split('@')[0];
      const result = await register({ username, password, email });

      if (result.success) {
        navigate('/bind-info');
      } else {
        setError(result.message || '注册失败');
      }
    } catch (err) {
      setError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col items-center justify-center relative selection:bg-primary-fixed selection:text-primary-fixed">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] warm-glow rounded-full pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[600px] h-[600px] warm-glow rounded-full pointer-events-none opacity-60" />

      {/* Top Navigation / Branding */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="text-3xl font-black text-orange-700 tracking-tighter flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 pointer-events-auto">
            <span>🍊</span>
            <span>意配</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-lg px-6 relative z-10 py-24">
        <div className="glass-card ghost-border rounded-[2rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(28,28,24,0.06)] flex flex-col items-center text-center">
          {/* Header Section */}
          <div className="mb-10 w-full">
            <h1 className="text-3xl font-bold font-headline text-on-surface tracking-tight mb-2">注册账号</h1>
            <p className="text-on-surface-variant text-sm">填写信息以开启你的灵魂之旅</p>
          </div>

          {/* Form Body */}
          <form className="w-full space-y-6 text-left" onSubmit={handleRegister}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-4">电子邮箱</label>
              <div className="relative group">
                <input
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-on-surface placeholder:text-outline/40 focus:ring-0 focus:bg-surface-container-lowest transition-all duration-300 ghost-border"
                  placeholder="name@hrbeu.edu.cn"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Verification Code Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-4">验证码</label>
              <div className="relative group">
                <input
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 pr-32 text-on-surface placeholder:text-outline/40 focus:ring-0 focus:bg-surface-container-lowest transition-all duration-300 ghost-border"
                  placeholder="6位数字"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-primary uppercase tracking-wider" type="button">
                  获取验证码
                </button>
              </div>
            </div>

            {/* Set Password Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-4">设置密码</label>
              <div className="relative group">
                <input
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-on-surface placeholder:text-outline/40 focus:ring-0 focus:bg-surface-container-lowest transition-all duration-300 ghost-border"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-4">确认密码</label>
              <div className="relative group">
                <input
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-on-surface placeholder:text-outline/40 focus:ring-0 focus:bg-surface-container-lowest transition-all duration-300 ghost-border"
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sunset-gradient text-white font-bold py-5 rounded-full shadow-lg shadow-orange-700/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? '注册中...' : '开启我的灵魂之旅'} <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </button>
          </form>

          {/* Bottom Guide */}
          <div className="pt-8 border-t border-orange-100/30 w-full mt-10">
            <p className="text-[12px] text-on-surface-variant/60 leading-relaxed mb-6">
              注册即代表同意 <a className="text-primary hover:underline underline-offset-4" href="#">《服务条款》</a> 与 <a className="text-primary hover:underline underline-offset-4" href="#">《隐私政策》</a>
            </p>
            <p className="text-sm font-medium text-on-surface-variant">
              已有账号？<Link to="/login" className="text-secondary font-bold hover:opacity-80 transition-opacity ml-1">立即登录</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Aesthetic Glow */}
      <div className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none">
        <div className="w-full h-full opacity-30 blur-[80px] bg-gradient-to-t from-orange-400 to-transparent" />
      </div>
    </div>
  );
};

export default RegisterPage;