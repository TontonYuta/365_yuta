import React, { useState } from 'react';
import { Trash2, Calendar, Clock, Tag, Search, Filter, X, ExternalLink } from 'lucide-react';
import { LearningSession, SubjectConfig } from '../types';

interface HistoryListProps {
  sessions: LearningSession[];
  subjects: SubjectConfig[];
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ sessions, subjects, onDelete }) => {
  const [filterSubjectId, setFilterSubjectId] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const getSubjectDetails = (id: string) => subjects.find(s => s.id === id) || { name: 'Unknown', color: '#cbd5e1' };

  // Advanced Filtering Logic
  const filteredSessions = sessions.filter(session => {
    // 1. Subject Filter
    if (filterSubjectId !== 'All' && session.subjectId !== filterSubjectId) return false;
    
    // 2. Search Content Filter (Case insensitive)
    if (searchTerm && !session.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // 3. Date Range Filter
    if (startDate && session.date < startDate) return false;
    if (endDate && session.date > endDate) return false;

    return true;
  });

  const hasActiveFilters = filterSubjectId !== 'All' || searchTerm !== '' || startDate !== '' || endDate !== '';

  const clearFilters = () => {
      setFilterSubjectId('All');
      setSearchTerm('');
      setStartDate('');
      setEndDate('');
  };

  // Get unique subject IDs present in history for the filter dropdown
  const subjectIdsInHistory: string[] = Array.from(new Set(sessions.map(s => s.subjectId)));

  const formatDate = (dateStr: string) => {
      try {
          const [year, month, day] = dateStr.split('-');
          return `${day}/${month}/${year}`;
      } catch (e) {
          return dateStr;
      }
  }

  if (sessions.length === 0) {
    return (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
            <p className="text-slate-400">Chưa có dữ liệu học tập. Hãy bắt đầu ngay!</p>
        </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header & Filter Controls */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        Hoạt động gần đây
                        <span className="text-xs font-normal text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {filteredSessions.length} / {sessions.length}
                        </span>
                    </h3>
                    
                    {/* Mobile Toggle Filter Button */}
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`md:hidden p-2 rounded-lg border transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500'}`}
                    >
                        <Filter className="w-4 h-4" />
                    </button>
                </div>

                {hasActiveFilters && (
                    <button 
                        onClick={clearFilters}
                        className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700 font-medium px-2 py-1 self-end md:self-auto"
                    >
                        <X className="w-3 h-3" /> Xóa bộ lọc
                    </button>
                )}
            </div>

            {/* Filter Inputs Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-12 gap-3 transition-all duration-300 ease-in-out ${showFilters ? 'block' : 'hidden md:grid'}`}>
                
                {/* Search */}
                <div className="md:col-span-4 relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm nội dung..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                </div>

                {/* Subject Select */}
                <div className="md:col-span-3">
                    <select 
                        className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
                        value={filterSubjectId}
                        onChange={(e) => setFilterSubjectId(e.target.value)}
                    >
                        <option value="All">Tất cả môn học</option>
                        {subjectIdsInHistory.map(id => {
                            const details = getSubjectDetails(id);
                            return <option key={id} value={id}>{details.name}</option>
                        })}
                    </select>
                </div>

                {/* Date Range */}
                <div className="md:col-span-5 flex items-center gap-2">
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600"
                        placeholder="Từ ngày"
                    />
                    <span className="text-slate-400">-</span>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600"
                        placeholder="Đến ngày"
                    />
                </div>
            </div>
        </div>

      <div className="overflow-x-auto">
        {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
                Không tìm thấy kết quả phù hợp với bộ lọc.
            </div>
        ) : (
            <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                <th className="px-6 py-3">Ngày</th>
                <th className="px-6 py-3">Môn học</th>
                <th className="px-6 py-3">Nội dung</th>
                <th className="px-6 py-3 text-center">Thời gian</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {filteredSessions.map((session) => {
                const subjectDetails = getSubjectDetails(session.subjectId);
                return (
                    <tr key={session.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(session.date)}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap"
                        style={{ backgroundColor: subjectDetails.color }}
                        >
                        {subjectDetails.name}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={session.content}>
                        <div className="flex flex-col">
                            <span>{session.content}</span>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {session.type}
                                </span>
                                {session.status === 'Chưa xong' && (
                                    <span className="text-xs text-amber-600 bg-amber-50 px-1.5 rounded">Chưa xong</span>
                                )}
                                {session.link && (
                                    <a 
                                        href={session.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Link
                                    </a>
                                )}
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">
                        <div className="flex items-center justify-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {session.durationMinutes}p
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button 
                        onClick={() => onDelete(session.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Xóa"
                        >
                        <Trash2 className="w-4 h-4" />
                        </button>
                    </td>
                    </tr>
                );
                })}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default HistoryList;