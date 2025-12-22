import { useState, useEffect, useMemo, useCallback } from 'react';
import { LearningSession, SubjectConfig, SubjectStats, GlobalStats } from '../types';
import { StorageService } from '../services/storage';

export const useLearningData = () => {
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [subjects, setSubjects] = useState<SubjectConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadedSessions = StorageService.loadSessions();
    const loadedSubjects = StorageService.loadSubjects();
    setSessions(loadedSessions);
    setSubjects(loadedSubjects);
    setLoading(false);
  }, []);

  // Persist data on change
  useEffect(() => {
    if (!loading) {
      StorageService.saveSessions(sessions);
    }
  }, [sessions, loading]);

  useEffect(() => {
    if (!loading) {
      StorageService.saveSubjects(subjects);
    }
  }, [subjects, loading]);

  const addSession = useCallback((session: Omit<LearningSession, 'id' | 'createdAt'>) => {
    const newSession: LearningSession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
  }, []);

  const updateSession = useCallback((id: string, updates: Partial<LearningSession>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateSubjectConfig = useCallback((updatedSubject: SubjectConfig) => {
    setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
  }, []);

  const addSubject = useCallback((newSubjectData: Pick<SubjectConfig, 'name' | 'color' | 'targetSessions'>) => {
    const newSubject: SubjectConfig = {
      id: crypto.randomUUID(),
      isActive: true,
      ...newSubjectData
    };
    setSubjects(prev => [...prev, newSubject]);
  }, []);

  // --- Statistics Logic ---

  const stats = useMemo(() => {
    const subjectStatsMap: Record<string, SubjectStats> = {};
    let globalTotalSessions = 0;
    let globalTotalMinutes = 0;
    let globalTodayMinutes = 0;
    
    // Initialize stats for all active subjects
    subjects.forEach(sub => {
      subjectStatsMap[sub.id] = {
        subjectId: sub.id,
        subjectName: sub.name,
        color: sub.color,
        totalSessions: 0,
        totalMinutes: 0,
        completedSessions: 0,
        progressPercent: 0,
        remainingSessions: sub.targetSessions
      };
    });

    const todayStr = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD in local time

    sessions.forEach(session => {
      // Subject specific (only if subject exists in config)
      if (subjectStatsMap[session.subjectId]) {
        subjectStatsMap[session.subjectId].totalSessions += session.count;
        subjectStatsMap[session.subjectId].totalMinutes += session.durationMinutes;
        
        if (session.status === 'Hoàn thành') {
          subjectStatsMap[session.subjectId].completedSessions += session.count;
        }
      }

      // Global (count everything, even if subject deleted/inactive for now, strictly speaking depends on requirements, but let's count all)
      globalTotalSessions += session.count;
      globalTotalMinutes += session.durationMinutes;
      
      if (session.date === todayStr) {
        globalTodayMinutes += session.durationMinutes;
      }
    });

    // Calculate percentages
    Object.keys(subjectStatsMap).forEach(key => {
      const s = subjectStatsMap[key];
      // Find the config to get target
      const config = subjects.find(sub => sub.id === s.subjectId);
      const target = config ? config.targetSessions : 365;

      s.progressPercent = Math.min(100, Math.round((s.completedSessions / target) * 100));
      s.remainingSessions = Math.max(0, target - s.completedSessions);
    });

    return {
      subjectStats: Object.values(subjectStatsMap), // Convert to array for easier consumption
      globalTotalSessions,
      globalTotalMinutes,
      globalTodayMinutes
    };
  }, [sessions, subjects]);

  // --- Streak Logic ---
  
  const streakStats = useMemo(() => {
    // 1. Filter completed sessions and get unique dates
    const completedDates = new Set<string>(
      sessions
        .filter(s => s.status === 'Hoàn thành')
        .map(s => s.date)
    );
    
    const sortedDates = Array.from(completedDates).sort((a, b) => b.localeCompare(a)); // Descending

    if (sortedDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // 2. Calculate Current Streak
    let currentStreak = 0;
    
    // Use local time for today
    const now = new Date();
    const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = new Date(yesterday.getTime() - (yesterday.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    // Check if the streak is alive (has entry today OR yesterday)
    const hasToday = sortedDates.includes(todayStr);
    const hasYesterday = sortedDates.includes(yesterdayStr);

    if (hasToday || hasYesterday) {
      // Start counting from the most recent valid date
      let checkDate = new Date(hasToday ? todayStr : yesterdayStr);
      
      while (true) {
        const checkStr = checkDate.toISOString().split('T')[0];
        if (completedDates.has(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // 3. Calculate Longest Streak
    let longestStreak = 0;
    let tempStreak = 0;
    
    const ascDates = [...sortedDates].reverse();
    
    for (let i = 0; i < ascDates.length; i++) {
        if (i === 0) {
            tempStreak = 1;
            continue;
        }
        
        const curr = new Date(ascDates[i]);
        const prev = new Date(ascDates[i-1]);
        
        const diffTime = Math.abs(curr.getTime() - prev.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
            tempStreak++;
        } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }, [sessions]);


  const globalStats: GlobalStats = {
    totalSessions: stats.globalTotalSessions,
    totalMinutes: stats.globalTotalMinutes,
    todayMinutes: stats.globalTodayMinutes,
    currentStreak: streakStats.currentStreak,
    longestStreak: streakStats.longestStreak
  };

  return {
    sessions,
    subjects,
    addSession,
    updateSession,
    deleteSession,
    updateSubjectConfig,
    addSubject,
    subjectStats: stats.subjectStats,
    globalStats,
    loading
  };
};