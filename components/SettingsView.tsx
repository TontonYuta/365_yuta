import React, { useState } from 'react';
import { SubjectConfig } from '../types';
import { Eye, EyeOff, Target, Plus, Save } from 'lucide-react';

interface SettingsViewProps {
  subjects: SubjectConfig[];
  onUpdateSubject: (subject: SubjectConfig) => void;
  onAddSubject: (subject: Pick<SubjectConfig, 'name' | 'color' | 'targetSessions'>) => void;
}

const PRESET_COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'
];

const SettingsView: React.FC<SettingsViewProps> = ({ subjects, onUpdateSubject, onAddSubject }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [newTarget, setNewTarget] = useState(365);

  const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      if(newName.trim()) {
          onAddSubject({
              name: newName,
              color: newColor,
              targetSessions: newTarget
          });
          setNewName('');
          setIsAdding(false);
      }
  };

  return (
    <div className="space-y-6">
      
      {/* Subject Management Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Quản lý Môn học
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Cấu hình mục tiêu hoặc thêm môn học mới.
                </p>
            </div>
            {!isAdding && (
                <button 
                    onClick={() => setIsAdding(true)}
                    className="text-sm bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Thêm môn
                </button>
            )}
        </div>

        {isAdding && (
            <form onSubmit={handleAdd} className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Thông tin môn học mới</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Tên môn học</label>
                        <input 
                            type="text" required autoFocus
                            placeholder="VD: Tiếng Trung"
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Mục tiêu (buổi)</label>
                        <input 
                            type="number" min="1" required
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={newTarget}
                            onChange={e => setNewTarget(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Màu sắc</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                className="h-9 w-9 p-0.5 rounded border border-slate-300 cursor-pointer"
                                value={newColor}
                                onChange={e => setNewColor(e.target.value)}
                            />
                            <div className="flex gap-1">
                                {PRESET_COLORS.slice(0, 3).map(c => (
                                    <button 
                                        key={c} type="button" 
                                        className="w-4 h-4 rounded-full border border-slate-200" 
                                        style={{backgroundColor: c}}
                                        onClick={() => setNewColor(c)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button 
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit"
                        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
                    >
                        <Save className="w-4 h-4" /> Lưu môn học
                    </button>
                </div>
            </form>
        )}

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="px-4 py-3">Môn học</th>
                        <th className="px-4 py-3">Mục tiêu</th>
                        <th className="px-4 py-3 text-center">Hiển thị</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {subjects.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-4 font-medium flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full border border-slate-100 shadow-sm flex-shrink-0" style={{ backgroundColor: sub.color }}></div>
                                <span className={!sub.isActive ? 'text-slate-400 line-through' : 'text-slate-700'}>
                                    {sub.name}
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                <input 
                                    type="number" 
                                    min="1"
                                    max="3650"
                                    className="w-20 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-center"
                                    value={sub.targetSessions}
                                    onChange={(e) => onUpdateSubject({ ...sub, targetSessions: parseInt(e.target.value) || 365 })}
                                    disabled={!sub.isActive}
                                />
                            </td>
                            <td className="px-4 py-4 text-center">
                                <button
                                    onClick={() => onUpdateSubject({ ...sub, isActive: !sub.isActive })}
                                    className={`p-2 rounded-lg transition-colors ${
                                        sub.isActive 
                                        ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' 
                                        : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                                    }`}
                                    title={sub.isActive ? 'Hiển thị' : 'Đang ẩn'}
                                >
                                    {sub.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;