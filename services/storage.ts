import { LearningSession, SubjectConfig } from '../types';
import { DEFAULT_SUBJECTS } from '../constants';

const DATA_KEY = 'learning_tracker_data_v1';
const CONFIG_KEY = 'learning_tracker_config_v1';

export const StorageService = {
  loadSessions: (): LearningSession[] => {
    try {
      const data = localStorage.getItem(DATA_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load sessions', error);
      return [];
    }
  },

  saveSessions: (sessions: LearningSession[]): void => {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save sessions', error);
    }
  },

  loadSubjects: (): SubjectConfig[] => {
    try {
      const data = localStorage.getItem(CONFIG_KEY);
      return data ? JSON.parse(data) : DEFAULT_SUBJECTS;
    } catch (error) {
      console.error('Failed to load subjects', error);
      return DEFAULT_SUBJECTS;
    }
  },

  saveSubjects: (subjects: SubjectConfig[]): void => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(subjects));
    } catch (error) {
      console.error('Failed to save subjects', error);
    }
  },

  clearData: (): void => {
    localStorage.removeItem(DATA_KEY);
    localStorage.removeItem(CONFIG_KEY);
  },

  // Export data to a JSON object
  exportData: () => {
    const sessions = localStorage.getItem(DATA_KEY);
    const subjects = localStorage.getItem(CONFIG_KEY);
    return {
      sessions: sessions ? JSON.parse(sessions) : [],
      subjects: subjects ? JSON.parse(subjects) : DEFAULT_SUBJECTS,
      exportDate: new Date().toISOString(),
      version: 1
    };
  },

  // Import and validate data
  importData: (jsonData: any): boolean => {
    try {
      if (!jsonData.sessions || !Array.isArray(jsonData.sessions)) throw new Error("Invalid sessions data");
      if (!jsonData.subjects || !Array.isArray(jsonData.subjects)) throw new Error("Invalid subjects data");
      
      localStorage.setItem(DATA_KEY, JSON.stringify(jsonData.sessions));
      localStorage.setItem(CONFIG_KEY, JSON.stringify(jsonData.subjects));
      return true;
    } catch (error) {
      console.error("Import failed:", error);
      return false;
    }
  }
};