// Domain Types

export type SessionType = 'Lý thuyết' | 'Thực hành' | 'Ôn tập' | 'Dự án';
export type SessionStatus = 'Hoàn thành' | 'Chưa xong';

export interface SubjectConfig {
  id: string;
  name: string;
  color: string;
  targetSessions: number;
  isActive: boolean;
}

export interface LearningSession {
  id: string;
  date: string; // ISO YYYY-MM-DD
  subjectId: string; // References SubjectConfig.id
  content: string;
  count: number; // Default 1
  durationMinutes: number;
  type: SessionType;
  status: SessionStatus;
  createdAt: number; // Timestamp
}

export interface SubjectStats {
  subjectId: string;
  subjectName: string;
  color: string;
  totalSessions: number;
  totalMinutes: number;
  completedSessions: number;
  progressPercent: number; // vs target
  remainingSessions: number;
}

export interface GlobalStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  todayMinutes: number;
}