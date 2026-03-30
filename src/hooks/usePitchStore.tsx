import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Types for exercise data storage
export interface ExerciseData {
  [fieldId: string]: string;
}

export interface SectionData {
  exercises: Record<string, ExerciseData>;
  currentStep: number;
  completado: boolean;
}

export interface PitchKitBlock {
  content: string;
  savedAt: string;
  wordCount: number;
}

export interface PitchData {
  userName: string;
  startupName: string;
  blocks: Record<number, string>;
  sections: Record<number, SectionData>;
  pitchKit: Record<number, PitchKitBlock>;
  currentBlock: number;
  createdAt: string;
  updatedAt: string;
}

const getDefaultSectionData = (): SectionData => ({
  exercises: {},
  currentStep: 0,
  completado: false,
});

const getDefaultData = (): PitchData => ({
  userName: '',
  startupName: '',
  blocks: {},
  sections: {},
  pitchKit: {},
  currentBlock: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface PitchStoreValue {
  data: PitchData;
  saveStatus: SaveStatus;
  isLoading: boolean;
  setUserInfo: (userName: string, startupName: string) => void;
  setBlockContent: (blockNumber: number, content: string) => void;
  setCurrentBlock: (blockNumber: number) => void;
  setExerciseData: (sectionNumber: number, exerciseId: string, fieldData: ExerciseData) => void;
  setSectionStep: (sectionNumber: number, step: number) => void;
  getSectionExercises: (sectionNumber: number) => Record<string, ExerciseData>;
  getSectionStep: (sectionNumber: number) => number;
  getProtagonistData: () => Record<string, string>;
  getCompletedBlocks: () => number[];
  isBlockCompleted: (blockNumber: number) => boolean;
  getNextIncompleteBlock: () => number | null;
  getTotalWords: () => number;
  resetData: () => Promise<void>;
  hasStarted: boolean;
  saveToPitchKit: (blockNumber: number, content: string) => void;
  getPitchKitBlocks: () => Record<number, PitchKitBlock>;
  getPitchKitCompletedCount: () => number;
  getPitchKitTotalWords: () => number;
  flushSave: () => Promise<void>;
}

const PitchStoreContext = createContext<PitchStoreValue | null>(null);

export function PitchStoreProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<PitchData>(getDefaultData);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isLoading, setIsLoading] = useState(true);

  const loadedUserIdRef = useRef<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const dataRef = useRef(data);
  const userRef = useRef(user);
  const isLoadingRef = useRef(isLoading);
  const isDirtyRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { userRef.current = user; }, [user]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);

  // Load data from database when user is authenticated
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      loadedUserIdRef.current = null;
      setData(getDefaultData());
      setIsLoading(false);
      return;
    }

    if (loadedUserIdRef.current === user.id) {
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      const { data: pitchData, error } = await supabase
        .from('pitch_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading pitch data:', error);
        setIsLoading(false);
        return;
      }

      if (pitchData) {
        setData({
          userName: pitchData.user_name || '',
          startupName: pitchData.startup_name || '',
          blocks: (pitchData.blocks as unknown as Record<number, string>) || {},
          sections: (pitchData.sections as unknown as Record<number, SectionData>) || {},
          pitchKit: (pitchData.pitch_kit as unknown as Record<number, PitchKitBlock>) || {},
          currentBlock: pitchData.current_block || 1,
          createdAt: pitchData.created_at,
          updatedAt: pitchData.updated_at,
        });
      }
      loadedUserIdRef.current = user.id;
      setIsLoading(false);
    };

    loadData();
  }, [user, authLoading]);

  // Core save function — performs the actual upsert
  const performSave = useCallback(async (): Promise<boolean> => {
    const currentUser = userRef.current;
    const currentData = dataRef.current;
    if (!currentUser || isLoadingRef.current || !isDirtyRef.current) return true;
    if (isSavingRef.current) return true; // already saving

    isSavingRef.current = true;
    isDirtyRef.current = false;
    setSaveStatus('saving');

    const updatePayload = {
      user_id: currentUser.id,
      user_name: currentData.userName,
      startup_name: currentData.startupName,
      blocks: currentData.blocks,
      sections: currentData.sections,
      pitch_kit: currentData.pitchKit,
      current_block: currentData.currentBlock,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase
      .from('pitch_data')
      .upsert(updatePayload as any, { onConflict: 'user_id' });

    isSavingRef.current = false;

    if (error) {
      console.error('Error saving pitch data:', error);
      isDirtyRef.current = true; // Mark dirty again so retry picks it up
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return false;
    }

    setSaveStatus('saved');
    setTimeout(() => {
      // Only go idle if nothing else dirtied in the meantime
      if (!isDirtyRef.current) setSaveStatus('idle');
    }, 2000);
    return true;
  }, []);

  // Schedule a debounced save (single layer — 800ms)
  const scheduleSave = useCallback(() => {
    isDirtyRef.current = true;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, 800);
  }, [performSave]);

  // Flush: cancel debounce and save immediately — used on unmount / beforeunload
  const flushSave = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    await performSave();
  }, [performSave]);

  // Auto-save interval every 30 seconds as safety net
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirtyRef.current) performSave();
    }, 30000);
    return () => clearInterval(interval);
  }, [performSave]);

  // beforeunload — flush pending saves when tab closes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;
      // Synchronous attempt: use sendBeacon for reliability
      const currentUser = userRef.current;
      const currentData = dataRef.current;
      if (currentUser) {
        const payload = {
          user_id: currentUser.id,
          user_name: currentData.userName,
          startup_name: currentData.startupName,
          blocks: currentData.blocks,
          sections: currentData.sections,
          pitch_kit: currentData.pitchKit,
          current_block: currentData.currentBlock,
        };
        // Try sendBeacon as last resort
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/pitch_data?on_conflict=user_id`;
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        const headers = {
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${currentUser.id}`, // won't work for auth but best effort
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        };
        // sendBeacon doesn't support custom headers, so we just warn user
        e.preventDefault();
        e.returnValue = 'Tienes cambios sin guardar. ¿Seguro que quieres salir?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (isDirtyRef.current && userRef.current) {
        performSave();
      }
    };
  }, [performSave]);

  // visibilitychange — flush when tab goes hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && isDirtyRef.current) {
        performSave();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [performSave]);

  const setUserInfo = useCallback((userName: string, startupName: string) => {
    setData(prev => ({ ...prev, userName, startupName, updatedAt: new Date().toISOString() }));
    scheduleSave();
  }, [scheduleSave]);

  const setBlockContent = useCallback((blockNumber: number, content: string) => {
    setData(prev => {
      const newBlocks = { ...prev.blocks, [blockNumber]: content };
      // Only mark completado if user explicitly has content — but don't auto-mark from AI drafts
      // Completion is determined by pitchKit saves, not block drafts
      return { ...prev, blocks: newBlocks, updatedAt: new Date().toISOString() };
    });
    scheduleSave();
  }, [scheduleSave]);

  const setCurrentBlock = useCallback((blockNumber: number) => {
    setData(prev => ({ ...prev, currentBlock: blockNumber, updatedAt: new Date().toISOString() }));
    scheduleSave();
  }, [scheduleSave]);

  const setExerciseData = useCallback((sectionNumber: number, exerciseId: string, fieldData: ExerciseData) => {
    setData(prev => {
      const sectionData = prev.sections[sectionNumber] || getDefaultSectionData();
      const newExercises = {
        ...sectionData.exercises,
        [exerciseId]: {
          ...(sectionData.exercises[exerciseId] || {}),
          ...fieldData,
        },
      };
      const newSections = {
        ...prev.sections,
        [sectionNumber]: {
          ...sectionData,
          exercises: newExercises,
        },
      };
      return { ...prev, sections: newSections, updatedAt: new Date().toISOString() };
    });
    scheduleSave();
  }, [scheduleSave]);

  const setSectionStep = useCallback((sectionNumber: number, step: number) => {
    setData(prev => {
      const sectionData = prev.sections[sectionNumber] || getDefaultSectionData();
      const newSections = {
        ...prev.sections,
        [sectionNumber]: {
          ...sectionData,
          currentStep: step,
        },
      };
      return { ...prev, sections: newSections, updatedAt: new Date().toISOString() };
    });
    scheduleSave();
  }, [scheduleSave]);

  const getSectionExercises = useCallback((sectionNumber: number): Record<string, ExerciseData> => {
    return data.sections[sectionNumber]?.exercises || {};
  }, [data.sections]);

  const getSectionStep = useCallback((sectionNumber: number): number => {
    return data.sections[sectionNumber]?.currentStep || 0;
  }, [data.sections]);

  const getProtagonistData = useCallback(() => {
    const section1Exercises = data.sections[1]?.exercises || {};
    const protagonistExercise = section1Exercises['1_3'] || {};
    return {
      nombre: protagonistExercise.nombre || '',
      edad: protagonistExercise.edad || '',
      profesion: protagonistExercise.profesion || '',
      ciudad: protagonistExercise.ciudad || '',
      contexto: protagonistExercise.contexto || '',
      aspiracion: protagonistExercise.aspiracion || '',
      frustracion: protagonistExercise.frustracion || '',
    };
  }, [data.sections]);

  // completedBlocks now based on pitchKit saves (the final version), not drafts
  const getCompletedBlocks = useCallback(() => {
    return Object.entries(data.pitchKit)
      .filter(([_, block]) => block?.content?.trim().length > 0)
      .map(([num]) => parseInt(num));
  }, [data.pitchKit]);

  const isBlockCompleted = useCallback((blockNumber: number) => {
    return !!data.pitchKit[blockNumber]?.content?.trim();
  }, [data.pitchKit]);

  const getNextIncompleteBlock = useCallback(() => {
    for (let i = 1; i <= 9; i++) {
      if (!data.pitchKit[i]?.content?.trim()) return i;
    }
    return null;
  }, [data.pitchKit]);

  const getTotalWords = useCallback(() => {
    return Object.values(data.pitchKit)
      .map(b => b?.content || '')
      .join(' ')
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }, [data.pitchKit]);

  const resetData = useCallback(async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('pitch_data')
      .delete()
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error resetting data:', error);
      return;
    }
    
    isDirtyRef.current = false;
    setData(getDefaultData());
  }, [user]);

  const saveToPitchKit = useCallback((blockNumber: number, content: string) => {
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setData(prev => {
      const newPitchKit = {
        ...prev.pitchKit,
        [blockNumber]: {
          content,
          savedAt: new Date().toISOString(),
          wordCount,
        },
      };
      return { ...prev, pitchKit: newPitchKit, updatedAt: new Date().toISOString() };
    });
    scheduleSave();
  }, [scheduleSave]);

  const getPitchKitBlocks = useCallback(() => {
    return data.pitchKit;
  }, [data.pitchKit]);

  const getPitchKitCompletedCount = useCallback(() => {
    return Object.keys(data.pitchKit).filter(k => data.pitchKit[parseInt(k)]?.content?.trim().length > 0).length;
  }, [data.pitchKit]);

  const getPitchKitTotalWords = useCallback(() => {
    return Object.values(data.pitchKit)
      .reduce((total, block) => total + (block?.wordCount || 0), 0);
  }, [data.pitchKit]);

  const hasStarted = data.userName.length > 0 && data.startupName.length > 0;

  const value: PitchStoreValue = {
    data,
    saveStatus,
    isLoading,
    setUserInfo,
    setBlockContent,
    setCurrentBlock,
    setExerciseData,
    setSectionStep,
    getSectionExercises,
    getSectionStep,
    getProtagonistData,
    getCompletedBlocks,
    isBlockCompleted,
    getNextIncompleteBlock,
    getTotalWords,
    resetData,
    hasStarted,
    saveToPitchKit,
    getPitchKitBlocks,
    getPitchKitCompletedCount,
    getPitchKitTotalWords,
    flushSave,
  };

  return (
    <PitchStoreContext.Provider value={value}>
      {children}
    </PitchStoreContext.Provider>
  );
}

export function usePitchStore() {
  const ctx = useContext(PitchStoreContext);
  if (!ctx) {
    throw new Error('usePitchStore must be used within a PitchStoreProvider');
  }
  return ctx;
}
