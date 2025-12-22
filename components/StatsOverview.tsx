import React from 'react';
import { Flame, Trophy, Clock, Target } from 'lucide-react';
import { GlobalStats } from '../types';

interface StatsOverviewProps {
  stats: GlobalStats;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  colorClass: string;
}> = ({ title, value, subtitle, icon, colorClass }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
    </div>
    <div className={`p-3 rounded-lg ${colorClass}`}>
      {icon}
    </div>
  </div>
);

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Chuỗi liên tục" 
        value={stats.currentStreak} 
        subtitle="Ngày liên tiếp"
        icon={<Flame className="w-5 h-5 text-orange-600" />}
        colorClass="bg-orange-100"
      />
      <StatCard 
        title="Tổng số buổi" 
        value={stats.totalSessions} 
        subtitle="Đã hoàn thành"
        icon={<Target className="w-5 h-5 text-blue-600" />}
        colorClass="bg-blue-100"
      />
      <StatCard 
        title="Tổng giờ học" 
        value={(stats.totalMinutes / 60).toFixed(1)} 
        subtitle="Thời gian đầu tư"
        icon={<Clock className="w-5 h-5 text-violet-600" />}
        colorClass="bg-violet-100"
      />
      <StatCard 
        title="Chuỗi dài nhất" 
        value={stats.longestStreak} 
        subtitle="Kỷ lục cá nhân"
        icon={<Trophy className="w-5 h-5 text-yellow-600" />}
        colorClass="bg-yellow-100"
      />
    </div>
  );
};

export default StatsOverview;