import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SubjectStats } from '../types';

interface ProgressDashboardProps {
  subjectStats: SubjectStats[];
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ subjectStats }) => {
  // Sort by highest progress
  const chartData = [...subjectStats]
    .sort((a, b) => b.progressPercent - a.progressPercent)
    .map(sub => ({
        name: sub.subjectName,
        completed: sub.completedSessions,
        remaining: sub.remainingSessions,
        color: sub.color
    }));

  if (subjectStats.length === 0) {
      return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subject Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Tiến độ Môn học</h3>
            <div className="space-y-5">
                {subjectStats.map(stat => {
                    return (
                        <div key={stat.subjectId}>
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-medium text-slate-700">{stat.subjectName}</span>
                                <span className="text-xs text-slate-500">
                                    {stat.completedSessions} / {stat.completedSessions + stat.remainingSessions} ({stat.progressPercent}%)
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className="h-2.5 rounded-full transition-all duration-500" 
                                    style={{ width: `${stat.progressPercent}%`, backgroundColor: stat.color }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Phân bổ Buổi học</h3>
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={100} 
                            tick={{fontSize: 10, fill: '#64748b'}} 
                            interval={0}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{fill: '#f8fafc'}}
                        />
                        <Bar dataKey="completed" radius={[0, 4, 4, 0]} barSize={20}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;