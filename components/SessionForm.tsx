import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, BookOpen, Tag, Calendar, Zap } from 'lucide-react';
import { SessionType, SessionStatus, LearningSession, SubjectConfig } from '../types';
import { SESSION_TYPES, SESSION_STATUSES } from '../constants';

interface SessionFormProps {
  subjects: SubjectConfig[];
  onAdd: (session: Omit<LearningSession, 'id' | 'createdAt'>) => void;
}

const DURATION_PRESETS = [30, 45, 60, 90, 120];
const CONTENT_SUGGESTIONS = ["Học bài mới", "Làm bài tập", "Ôn tập kiến thức cũ", "Đọc tài liệu", "Code dự án"];

// Helper to get YYYY-MM-DD in local time
const getLocalDateString = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SessionForm: React.FC<SessionFormProps> = ({ subjects, onAdd }) => {
  const activeSubjects = subjects.filter(s => s.isActive);
  
  const [date, setDate] = useState(getLocalDateString());
  const [subjectId, setSubjectId] = useState<string>('');
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState<number>(60);
  const [type, setType] = useState<SessionType>('Lý thuyết');
  const [status, setStatus] = useState<SessionStatus>('Hoàn thành');
  const [count, setCount] = useState<number>(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Load last used subject from localStorage
  useEffect(() => {
    const savedSubjectId = localStorage.getItem('lastUsedSubjectId');
    if (activeSubjects.length > 0) {
      // Prioritize saved subject if it's still active, otherwise first active subject
      const targetId = activeSubjects.find(s => s.id === savedSubjectId) ? savedSubjectId : activeSubjects[0].id;
      if (!subjectId) setSubjectId(targetId);
    }
  }, [activeSubjects, subjectId]);

  // Save subject to localStorage on change
  const handleSubjectChange = (id: string) => {
    setSubjectId(id);
    localStorage.setItem('lastUsedSubjectId', id);
  };

  const setDateOffset = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    setDate(getLocalDateString(d));
    setShowDatePicker(false);
  };

  const isToday = (dateStr: string) => dateStr === getLocalDateString();
  const isYesterday = (dateStr: string) => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return dateStr === getLocalDateString(d);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) return;

    onAdd({
      date,
      subjectId,
      content: content || "Tự học", // Default content if empty
      durationMinutes: duration,
      type,
      status,
      count
    });
    
    // Feedback animation
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);

    // Reset fields but keep Date (user might log multiple for same day) and Subject (sticky)
    setContent('');
    setStatus('Hoàn thành');
  };

  if (activeSubjects.length === 0) {
      return (
          <div className="bg-white p-6 rounded-xl border border-dashed border-slate-200 text-center text-slate-500">
              Không tìm thấy môn học nào. Vui lòng thêm môn học trong phần Cài đặt.
          </div>
      )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative overflow-hidden transition-all">
      {justSaved && (
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-[pulse_1s_ease-in-out]" />
      )}
      
      <h2 className="text-lg font-semibold text-slate-800 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Thêm Buổi Học
        </div>
        {justSaved && <span className="text-xs font-bold text-green-600 animate-fade-in flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Đã lưu</span>}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Quick Date Selection */}
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Thời gian</label>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setDateOffset(0)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${isToday(date) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    Hôm nay
                </button>
                <button
                    type="button"
                    onClick={() => setDateOffset(-1)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${isYesterday(date) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    Hôm qua
                </button>
                <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={`px-3 rounded-lg border transition-all flex items-center justify-center ${showDatePicker || (!isToday(date) && !isYesterday(date)) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-400'}`}
                >
                    <Calendar className="w-5 h-5" />
                </button>
            </div>
            {(showDatePicker || (!isToday(date) && !isYesterday(date))) && (
                <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-2 rounded-lg border-slate-200 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none animate-fade-in"
                />
            )}
        </div>

        {/* Subject Selection */}
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Môn học</label>
            <div className="relative">
              <select 
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full rounded-lg border-slate-200 border p-3 text-base font-medium appearance-none bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {activeSubjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
        </div>

        {/* Content & Suggestions */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Nội dung</label>
          <input 
            type="text" 
            placeholder="VD: Chương 4, Làm bài tập..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border-slate-200 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
              {CONTENT_SUGGESTIONS.map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setContent(sug)}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full whitespace-nowrap transition-colors"
                  >
                      {sug}
                  </button>
              ))}
          </div>
        </div>

        {/* Duration with Chips */}
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Thời lượng (phút)</label>
            <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                {DURATION_PRESETS.map(min => (
                    <button
                        key={min}
                        type="button"
                        onClick={() => setDuration(min)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            duration === min 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {min}p
                    </button>
                ))}
            </div>
            <div className="relative">
              <input 
                type="number" 
                min="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-lg border-slate-200 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none pl-9"
              />
              <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
        </div>

        {/* Type & Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Hình thức</label>
            <div className="relative">
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as SessionType)}
                className="w-full rounded-lg border-slate-200 border p-2.5 text-sm appearance-none bg-white outline-none"
              >
                {SESSION_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <Tag className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Trạng thái</label>
            <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as SessionStatus)}
                className={`w-full rounded-lg border p-2.5 text-sm appearance-none outline-none font-medium ${status === 'Hoàn thành' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}
            >
                {SESSION_STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all transform active:scale-[0.98] flex justify-center items-center gap-2 mt-4"
        >
          <Zap className="w-5 h-5 fill-current" />
          Lưu Hoạt Động
        </button>

      </form>
    </div>
  );
};

export default SessionForm;