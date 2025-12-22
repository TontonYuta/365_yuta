import { SessionType, SessionStatus, SubjectConfig } from './types';

export const SESSION_TYPES: SessionType[] = [
  'Lý thuyết',
  'Thực hành',
  'Ôn tập',
  'Dự án',
];

export const SESSION_STATUSES: SessionStatus[] = [
  'Hoàn thành',
  'Chưa xong',
];

export const DEFAULT_SUBJECTS: SubjectConfig[] = [
  { id: 'CSDL', name: 'Cơ sở dữ liệu', color: '#3b82f6', targetSessions: 365, isActive: true },
  { id: 'LaTeX', name: 'Soạn thảo LaTeX', color: '#06b6d4', targetSessions: 365, isActive: true },
  { id: '365 IT', name: 'Kiến thức IT', color: '#8b5cf6', targetSessions: 365, isActive: true },
  { id: '365 Dart & Flutter', name: 'Lập trình Flutter', color: '#0ea5e9', targetSessions: 365, isActive: true },
  { id: '365 English', name: 'Tiếng Anh', color: '#f43f5e', targetSessions: 365, isActive: true },
  { id: '365 Web', name: 'Lập trình Web', color: '#10b981', targetSessions: 365, isActive: true },
];