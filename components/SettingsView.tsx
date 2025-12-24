import React, { useState, useRef } from 'react';
import { SubjectConfig } from '../types';
import { StorageService } from '../services/storage';
import { Eye, EyeOff, Target, Plus, Save, Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface SettingsViewProps {
  subjects: SubjectConfig[];
  onUpdateSubject: (subject: SubjectConfig) => void;
  onAddSubject: (subject: Pick<SubjectConfig, 'name' | 'color' | 'targetSessions'>) => void;
  onImportData?: (data: any) => boolean; // Optional prop for importing
}

const PRESET_COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'
];

const SettingsView: React.FC<SettingsViewProps> = ({ subjects, onUpdateSubject, onAddSubject, onImportData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [newTarget, setNewTarget] = useState(365);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = () => {
    const data = StorageService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `365tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (onImportData && onImportData(json)) {
            setImportStatus('success');
            setTimeout(() => setImportStatus('idle'), 3000);
        } else {
             // Fallback if prop not provided or failed inside hook, try direct service (though hook is preferred for state update)
             if (!onImportData && StorageService.importData(json)) {
                 setImportStatus('success');
                 window.location.reload(); // Force reload if not using hook
             } else {
                 setImportStatus('error');
             }
        }
      } catch (err) {
        console.error(err);
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      
      {/* Data Management Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Save className="w-5 h-5 text-indigo-600" />
            Sao lưu dữ liệu
          </h2>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4 text-sm text-indigo-800">
            Dữ liệu được lưu trên trình duyệt này. Hãy xuất file sao lưu thường xuyên để tránh mất dữ liệu khi xóa lịch sử web hoặc đổi thiết bị.
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
                <Download className="w-4 h-4" /> Xuất dữ liệu (.json)
            </button>
            
            <div className="relative">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Upload className="w-4 h-4" /> Khôi phục dữ liệu
                </button>
            </div>
          </div>

          {importStatus === 'success' && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600 font-medium animate-fade-in">
                  <CheckCircle className="w-4 h-4" /> Khôi phục thành công!
              </div>
          )}
          {importStatus === 'error' && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-600 font-medium animate-fade-in">
                  <AlertCircle className="w-4 h-4" /> File không hợp lệ. Vui lòng kiểm tra lại.
              </div>
          )}
      </div>

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