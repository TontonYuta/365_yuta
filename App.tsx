import React, { useState } from 'react';
import { useLearningData } from './hooks/useLearningData';
import SessionForm from './components/SessionForm';
import StatsOverview from './components/StatsOverview';
import ProgressDashboard from './components/ProgressDashboard';
import HistoryList from './components/HistoryList';
import SettingsView from './components/SettingsView';
import { LayoutDashboard, PlusCircle, History, GraduationCap, Settings } from 'lucide-react';

const App: React.FC = () => {
  const { 
    sessions,
    subjects, 
    addSession, 
    deleteSession, 
    updateSubjectConfig,
    addSubject,
    importData,
    subjectStats, 
    globalStats 
  } = useLearningData();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'history' | 'settings'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-indigo-600">
          <GraduationCap className="w-6 h-6" />
          <span>365 Tracker</span>
        </div>
      </div>

      {/* Sidebar / Navigation */}
      <aside className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-20 md:static md:w-64 md:h-screen md:border-t-0 md:border-r md:flex md:flex-col p-2 md:p-6">
        <div className="hidden md:flex items-center gap-3 font-bold text-2xl text-indigo-600 mb-10 px-2">
          <GraduationCap className="w-8 h-8" />
          <span>365 Tracker</span>
        </div>

        <nav className="flex justify-around md:flex-col md:justify-start gap-1 md:gap-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden md:inline">Tổng quan</span>
          </button>

          <button 
            onClick={() => setActiveTab('log')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'log' 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden md:inline">Thêm buổi học</span>
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history' 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <History className="w-5 h-5" />
            <span className="hidden md:inline">Lịch sử</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settings' 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="hidden md:inline">Cài đặt</span>
          </button>
        </nav>

        <div className="hidden md:block mt-auto px-4 py-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium uppercase mb-2">Trích dẫn trong ngày</p>
            <p className="text-xs italic text-slate-600">"Sự kiên trì là thứ biến điều bình thường trở thành xuất sắc."</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {activeTab === 'dashboard' && 'Tiến độ của bạn'}
              {activeTab === 'log' && 'Thêm buổi học'}
              {activeTab === 'history' && 'Lịch sử học tập'}
              {activeTab === 'settings' && 'Cài đặt'}
            </h1>
            <p className="text-slate-500 mt-1 capitalize">
               {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>

          {activeTab === 'dashboard' && (
            <div className="animate-fade-in space-y-8">
              <StatsOverview stats={globalStats} />
              <ProgressDashboard subjectStats={subjectStats} />
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Nhật ký gần đây</h3>
                <HistoryList sessions={sessions.slice(0, 5)} subjects={subjects} onDelete={deleteSession} />
              </div>
            </div>
          )}

          {activeTab === 'log' && (
            <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SessionForm subjects={subjects} onAdd={(s) => { addSession(s); setActiveTab('dashboard'); }} />
                </div>
                <div className="bg-indigo-600 rounded-xl p-6 text-white h-fit shadow-lg shadow-indigo-200">
                    <h3 className="font-bold text-lg mb-2">Bí quyết thành công</h3>
                    <ul className="space-y-3 text-indigo-100 text-sm list-disc pl-4">
                        <li>Tập trung vào sự đều đặn, không phải cường độ.</li>
                        <li>Xem lại ghi chú hôm qua trước khi bắt đầu bài mới.</li>
                        <li>Kết hợp lý thuyết với thực hành.</li>
                        <li>Ghi lại buổi học ngay sau khi hoàn thành.</li>
                    </ul>
                </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-fade-in">
              <HistoryList sessions={sessions} subjects={subjects} onDelete={deleteSession} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in">
                <SettingsView 
                    subjects={subjects} 
                    onUpdateSubject={updateSubjectConfig} 
                    onAddSubject={addSubject}
                    onImportData={importData}
                />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;