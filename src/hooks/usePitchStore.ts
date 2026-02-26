import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Types for exercise data storage
export interface ExerciseData {
  [fieldId: string]: string;
}

export interface SectionData {
  exercises: Record<string, ExerciseData>; // keyed by exercise id (e.g., "1_1", "1_2")
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
  pitchKit: Record<number, PitchKitBlock>; // Separate Pitch Kit storage
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

export function usePitchStore() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<PitchData>(getDefaultData);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);

  // Track if we've already loaded data for this user to avoid re-fetching on tab switch
  const loadedUserIdRef = React.useRef<string | null>(null);

  // Load data from database when user is authenticated
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      loadedUserIdRef.current = null;
      setData(getDefaultData());
      setIsLoading(false);
      return;
    }

    // Skip re-loading if we already loaded for this user (prevents tab-switch reset)
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

  // Save data to database with debouncing to prevent rapid consecutive saves
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = React.useRef<Partial<PitchData>>({});
  
  const saveToDatabase = useCallback(async (newData: Partial<PitchData>) => {
    if (!user) return;
    // CRITICAL: Don't save while still loading data from DB — would overwrite with empty defaults
    if (isLoading) return;

    // Merge pending data
    pendingDataRef.current = { ...pendingDataRef.current, ...newData };
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce the save
    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      
      const dataToSave = pendingDataRef.current;
      pendingDataRef.current = {};
      
      const updatePayload = {
        user_id: user.id,
        user_name: dataToSave.userName ?? data.userName,
        startup_name: dataToSave.startupName ?? data.startupName,
        blocks: dataToSave.blocks ?? data.blocks,
        sections: dataToSave.sections ?? data.sections,
        pitch_kit: dataToSave.pitchKit ?? data.pitchKit,
        current_block: dataToSave.currentBlock ?? data.currentBlock,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('pitch_data')
        .upsert(updatePayload as any, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving pitch data:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
        return;
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500); // 500ms debounce
  }, [user, data, isLoading]);

  const setUserInfo = useCallback(async (userName: string, startupName: string) => {
    const newData = { ...data, userName, startupName, updatedAt: new Date().toISOString() };
    setData(newData);
    await saveToDatabase({ userName, startupName });
  }, [data, saveToDatabase]);

  const setBlockContent = useCallback(async (blockNumber: number, content: string) => {
    setData(prev => {
      const newBlocks = { ...prev.blocks, [blockNumber]: content };
      const newSections = { ...prev.sections };
      if (content.trim().length > 0) {
        newSections[blockNumber] = {
          ...(newSections[blockNumber] || getDefaultSectionData()),
          completado: true,
        };
      }
      const updated = { ...prev, blocks: newBlocks, sections: newSections, updatedAt: new Date().toISOString() };
      saveToDatabase({ blocks: newBlocks, sections: newSections });
      return updated;
    });
  }, [saveToDatabase]);

  const setCurrentBlock = useCallback(async (blockNumber: number) => {
    setData(prev => {
      const updated = { ...prev, currentBlock: blockNumber, updatedAt: new Date().toISOString() };
      saveToDatabase({ currentBlock: blockNumber });
      return updated;
    });
  }, [saveToDatabase]);

  const setExerciseData = useCallback(async (sectionNumber: number, exerciseId: string, fieldData: ExerciseData) => {
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
      const updated = { ...prev, sections: newSections, updatedAt: new Date().toISOString() };
      saveToDatabase({ sections: newSections });
      return updated;
    });
  }, [saveToDatabase]);

  const setSectionStep = useCallback(async (sectionNumber: number, step: number) => {
    setData(prev => {
      const sectionData = prev.sections[sectionNumber] || getDefaultSectionData();
      const newSections = {
        ...prev.sections,
        [sectionNumber]: {
          ...sectionData,
          currentStep: step,
        },
      };
      const updated = { ...prev, sections: newSections, updatedAt: new Date().toISOString() };
      saveToDatabase({ sections: newSections });
      return updated;
    });
  }, [saveToDatabase]);

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
      rutina: protagonistExercise.rutina || '',
      frustracion: protagonistExercise.frustracion || '',
    };
  }, [data.sections]);

  const getCompletedBlocks = useCallback(() => {
    return Object.entries(data.blocks)
      .filter(([_, content]) => content && content.trim().length > 0)
      .map(([num]) => parseInt(num));
  }, [data.blocks]);

  const isBlockCompleted = useCallback((blockNumber: number) => {
    return data.blocks[blockNumber] && data.blocks[blockNumber].trim().length > 0;
  }, [data.blocks]);

  const getNextIncompleteBlock = useCallback(() => {
    for (let i = 1; i <= 9; i++) {
      if (!data.blocks[i] || data.blocks[i].trim().length === 0) return i;
    }
    return null;
  }, [data.blocks]);

  const getTotalWords = useCallback(() => {
    return Object.values(data.blocks)
      .join(' ')
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }, [data.blocks]);

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
    
    setData(getDefaultData());
  }, [user]);

  // Pitch Kit functions
  const saveToPitchKit = useCallback(async (blockNumber: number, content: string) => {
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
      const updated = { ...prev, pitchKit: newPitchKit, updatedAt: new Date().toISOString() };
      saveToDatabase({ pitchKit: newPitchKit });
      return updated;
    });
  }, [saveToDatabase]);

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

  return {
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
    // Pitch Kit
    saveToPitchKit,
    getPitchKitBlocks,
    getPitchKitCompletedCount,
    getPitchKitTotalWords,
  };
}
