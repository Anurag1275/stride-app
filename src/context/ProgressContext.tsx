import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProgressState {
  semester: number;
  completedTopics: Record<string, boolean>; // topicId → completed
  userNotes: Record<string, string[]>; // unitId → notes
  userName: string;
  course: string;
  examDate: string;
}

interface ProgressContextType extends ProgressState {
  setSemester: (sem: number) => void;
  toggleTopic: (topicId: string) => void;
  isTopicCompleted: (topicId: string) => boolean;
  addNote: (unitId: string, note: string) => void;
  removeNote: (unitId: string, index: number) => void;
  setUserName: (name: string) => void;
  setCourse: (course: string) => void;
  setExamDate: (date: string) => void;
  getSubjectProgress: (subjectId: string, topicIds: string[]) => number;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

const STORAGE_KEY = "sankalp-progress";

const defaultState: ProgressState = {
  semester: 3,
  completedTopics: {},
  userNotes: {},
  userName: "Student",
  course: "B.Tech CSE",
  examDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
};

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  // Sync userName from Supabase profile (profiles table → user_metadata fallback → "Student")
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const name =
          data?.display_name ||
          user.user_metadata?.display_name ||
          "Student";
        setState(s => ({ ...s, userName: name }));
      });
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setSemester = useCallback((sem: number) => setState(s => ({ ...s, semester: sem })), []);
  const toggleTopic = useCallback((topicId: string) => {
    setState(s => {
      const wasCompleted = !!s.completedTopics[topicId];
      if (!wasCompleted) {
        // Completing a topic — fire toasts
        toast("Nice work! Task completed ✓", {
          duration: 3000,
          style: {
            background: "#fff",
            borderLeft: "4px solid #22C55E",
            borderRadius: "12px",
            boxShadow: "0 4px 24px -6px rgba(0,0,0,0.1)",
          },
        });
        toast("You earned 10 XP! Keep going 🔥", {
          duration: 3000,
          style: {
            background: "#fff",
            borderLeft: "4px solid #B5541C",
            borderRadius: "12px",
            boxShadow: "0 4px 24px -6px rgba(0,0,0,0.1)",
          },
        });
      }
      return {
        ...s,
        completedTopics: { ...s.completedTopics, [topicId]: !wasCompleted },
      };
    });
  }, []);
  const isTopicCompleted = useCallback((topicId: string) => !!state.completedTopics[topicId], [state.completedTopics]);
  const addNote = useCallback((unitId: string, note: string) =>
    setState(s => ({
      ...s,
      userNotes: { ...s.userNotes, [unitId]: [...(s.userNotes[unitId] || []), note] },
    })), []);
  const removeNote = useCallback((unitId: string, index: number) =>
    setState(s => ({
      ...s,
      userNotes: { ...s.userNotes, [unitId]: (s.userNotes[unitId] || []).filter((_, i) => i !== index) },
    })), []);
  const setUserName = useCallback((name: string) => setState(s => ({ ...s, userName: name })), []);
  const setCourse = useCallback((course: string) => setState(s => ({ ...s, course })), []);
  const setExamDate = useCallback((date: string) => setState(s => ({ ...s, examDate: date })), []);
  const getSubjectProgress = useCallback((subjectId: string, topicIds: string[]) => {
    if (topicIds.length === 0) return 0;
    const completed = topicIds.filter(id => state.completedTopics[id]).length;
    return Math.round((completed / topicIds.length) * 100);
  }, [state.completedTopics]);

  return (
    <ProgressContext.Provider value={{
      ...state, setSemester, toggleTopic, isTopicCompleted,
      addNote, removeNote, setUserName, setCourse, setExamDate, getSubjectProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
};
