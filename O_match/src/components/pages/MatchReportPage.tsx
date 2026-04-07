import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * 匹配报告页面
 * 根据后端匹配引擎的响应数据生成
 * 包含契合度、灵魂雷达图、破冰任务、共鸣时刻等内容
 */
const MatchReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState<any>(null);

  // 页面加载时获取匹配报告数据
  useEffect(() => {
    // TODO: 对接后端 API 获取匹配报告数据
    // const fetchMatchReport = async () => {
    //   const response = await fetch('/api/matching/report', {
    //     headers: {
    //       'Authorization': `Bearer ${getToken()}`,
    //     }
    //   });
    //   const data = await response.json();
    //   setMatchData(data);
    //   setLoading(false);
    // };
    // fetchMatchReport();

    // 当前使用模拟数据（实际应从后端获取）
    setTimeout(() => {
      setMatchData({
        matchId: 'match_123456',
        compatibility: 98, // 契合度百分比
        rankPercent: 99.4, // 击败多少比例的校友组合
        matchedUser: {
          id: 'user_789',
          nickname: '灵魂伴侣',
          avatar: '',
        },
        radarData: {
          openness: 85,      // 开放性
          responsibility: 78, // 责任感
          agreeableness: 82,  // 宜人性
          neuroticism: 65,    // 神经质
          extraversion: 75,   // 外向性
        },
        iceBreakingTask: {
          title: '书单交换',
          description: '检测到你们的灵魂重合度极高。既然都偏爱 11 号楼的窗边座，不如在那交换一次近期最爱的书单？',
          location: '11 号楼的窗边座',
        },
        timeRemaining: '71:59:42', // 剩余时间
        resonancePoints: [
          {
            icon: 'night_shelter',
            title: '深夜思想家',
            description: '你们都勾选了"凌晨 2 点是灵感巅峰"，比起喧嚣的社交，更喜欢独处的静谧。',
            color: 'primary',
          },
          {
            icon: 'menu_book',
            title: '纸质书信徒',
            description: '都喜欢在学校 11 号楼的窗边阅读，且坚持认为纸张的触感无可替代。',
            color: 'secondary',
          },
          {
            icon: 'restaurant',
            title: '麻辣拌狂热',
            description: '在饮食倾向中，你们不约而同地把"加醋的麻辣拌"排到了第一位。',
            color: 'tertiary',
          },
        ],
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 mt-12 space-y-12 py-16 text-center">
        <div className="text-on-surface-variant">加载中...</div>
      </main>
    );
  }

  // 模拟数据（后端返回后替换）
  const compatibility = matchData?.compatibility || 98;
  const rankPercent = matchData?.rankPercent || 99.4;
  const radarData = matchData?.radarData || { openness: 85, responsibility: 78, agreeableness: 82, neuroticism: 65, extraversion: 75 };
  const iceTask = matchData?.iceBreakingTask || { title: '书单交换', description: '检测到你们的灵魂重合度极高。既然都偏爱 11 号楼的窗边座，不如在那交换一次近期最爱的书单？', location: '11 号楼的窗边座' };
  const timeRemaining = matchData?.timeRemaining || '71:59:42';
  const resonances = matchData?.resonancePoints || [
    { icon: 'night_shelter', title: '深夜思想家', description: '你们都勾选了"凌晨 2 点是灵感巅峰"，比起喧嚣的社交，更喜欢独处的静谧。', color: 'primary' },
    { icon: 'menu_book', title: '纸质书信徒', description: '都喜欢在学校 11 号楼的窗边阅读，且坚持认为纸张的触感无可替代。', color: 'secondary' },
    { icon: 'restaurant', title: '麻辣拌狂热', description: '在饮食倾向中，你们不约而同地把"加醋的麻辣拌"排到了第一位。', color: 'tertiary' },
  ];

  // 计算雷达图顶点坐标
  const getRadarPoints = () => {
    const center = 50;
    const maxRadius = 40;
    const points = [
      { x: center, y: center - maxRadius * (radarData.openness / 100) }, // 开放性 - 上
      { x: center + maxRadius * (radarData.extraversion / 100) * 0.95, y: center - maxRadius * (radarData.extraversion / 100) * 0.3 }, // 外向性 - 右上
      { x: center + maxRadius * (radarData.responsibility / 100) * 0.7, y: center + maxRadius * (radarData.responsibility / 100) * 0.7 }, // 责任感 - 右下
      { x: center - maxRadius * (radarData.agreeableness / 100) * 0.7, y: center + maxRadius * (radarData.agreeableness / 100) * 0.7 }, // 宜人性 - 左下
      { x: center - maxRadius * (radarData.neuroticism / 100) * 0.95, y: center - maxRadius * (radarData.neuroticism / 100) * 0.3 }, // 神经质 - 左上
    ];
    return points.map(p => `${p.x},${p.y}`).join(' ');
  };

  return (
    <main className="max-w-4xl mx-auto px-6 mt-12 space-y-12 pb-32">
      {/* Hero Section: The Ritual Reveal */}
      <section className="relative text-center py-16 px-8 rounded-[2rem] overflow-hidden bg-surface-container-low">
        <div className="absolute inset-0 opacity-10 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <span className="label-md text-primary font-semibold tracking-widest uppercase">Matching Report</span>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-on-surface">
            契合度 <span className="bg-gradient-to-tr from-primary to-primary-container bg-clip-text text-transparent">{compatibility}%</span>
          </h1>
          {/* Normal Distribution Visualization */}
          <div className="w-full max-w-md mx-auto pt-8">
            <div className="relative h-24 w-full">
              <svg className="w-full h-full text-surface-container-highest stroke-outline-variant fill-none" viewBox="0 0 400 100">
                <path d="M0,100 Q100,100 200,10 T300,100 T400,100" strokeWidth="2"></path>
                <circle className="fill-primary shadow-lg" cx="215" cy="22" r="6"></circle>
                <text className="text-[10px] font-bold fill-primary" x="230" y="25">YOU</text>
              </svg>
              <div className="mt-2 text-label-md text-on-surface-variant italic">
                恭喜！你们的契合度击败了全校 {rankPercent}% 的校友组合
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soul Radar & Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Radar Card */}
        <div className="md:col-span-7 glass-card bento-asymmetric p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">灵魂雷达图</h3>
            <p className="text-on-surface-variant text-sm mb-8">基于大五人格与生活轨迹的深度重合度分析</p>
          </div>
          <div className="relative aspect-square w-full max-w-[300px] mx-auto flex items-center justify-center">
            {/* Radar Mesh Background */}
            <div className="absolute inset-0 radar-grid bg-surface-container-high opacity-30" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}></div>
            <div className="absolute inset-4 radar-grid bg-surface-container-high opacity-50" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}></div>
            <div className="absolute inset-8 radar-grid bg-surface-container-high opacity-70" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}></div>
            {/* Radar Polygon Fill */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100">
              <polygon className="fill-primary/20 stroke-primary stroke-[1.5]" points={getRadarPoints()}></polygon>
              {/* Labels */}
              <text className="text-[6px] font-bold fill-on-surface" textAnchor="middle" x="50" y="5">开放性</text>
              <text className="text-[6px] font-bold fill-on-surface" textAnchor="start" x="95" y="35">责任感</text>
              <text className="text-[6px] font-bold fill-on-surface" textAnchor="middle" x="80" y="92">宜人性</text>
              <text className="text-[6px] font-bold fill-on-surface" textAnchor="middle" x="20" y="92">神经质</text>
              <text className="text-[6px] font-bold fill-on-surface" textAnchor="end" x="5" y="35">外向性</text>
            </svg>
          </div>
        </div>

        {/* Identity Preview Card */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="flex-1 glass-card rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-white/20">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-xl">celebration</span>
                <h4 className="text-xl font-bold tracking-tight">破冰任务</h4>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                {iceTask.description}
              </p>
            </div>
            <div className="mt-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase">
                <span className="w-1 h-1 rounded-full bg-primary"></span>
                Soul Connection
              </div>
            </div>
          </div>
          <div className="bg-secondary-fixed text-on-secondary-fixed p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined">schedule</span>
              <span className="text-sm font-bold">匹配时效</span>
            </div>
            <div className="text-4xl font-black tracking-tighter">{timeRemaining}</div>
            <p className="text-xs mt-2 opacity-80">缘分转瞬即逝，请在 3 天内开启首聊</p>
          </div>
        </div>
      </div>

      {/* Resonance Points: The Commonality Cards */}
      <section className="space-y-6">
        <h3 className="text-3xl font-bold tracking-tight px-2">共鸣时刻</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resonances.map((item: any, index: number) => (
            <div key={index} className="p-8 rounded-[2rem] bg-surface-container-low space-y-4 hover:shadow-xl transition-shadow">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                item.color === 'primary' ? 'bg-primary-fixed' :
                item.color === 'secondary' ? 'bg-secondary-fixed' :
                'bg-tertiary-fixed'
              }`}>
                <span className={`material-symbols-outlined ${
                  item.color === 'primary' ? 'text-primary' :
                  item.color === 'secondary' ? 'text-secondary' :
                  'text-tertiary'
                }`}>{item.icon}</span>
              </div>
              <h5 className="text-lg font-bold">{item.title}</h5>
              <p className="text-on-surface-variant text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center py-12 gap-4">
        <button
          onClick={() => navigate('/chat')}
          className="w-full max-w-md py-5 bg-gradient-to-tr from-primary to-primary-container text-white text-lg font-bold rounded-full shadow-[0_8px_32px_rgba(148,74,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          开启 72 小时限时聊天
        </button>
      </section>

      {/* Fallback/Next State */}
      <section className="mt-16 py-8 border-t border-outline-variant/20">
        <Link to="/waiting" className="block">
          <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">hourglass_empty</span>
              </div>
              <div>
                <p className="text-sm font-bold">想要更多可能？</p>
                <p className="text-xs text-on-surface-variant">下周三 12:00 准时开启</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </div>
        </Link>
      </section>
    </main>
  );
};

export default MatchReportPage;