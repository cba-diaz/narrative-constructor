import { useState, useEffect, useCallback } from 'react';

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

const STORAGE_KEY = 'pitch-de-pelicula-data';

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

const loadFromStorage = (): PitchData => {
  if (typeof window === 'undefined') {
    return getDefaultData();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure sections object exists (for backwards compatibility)
      if (!parsed.sections) {
        parsed.sections = {};
      }
      // Ensure pitchKit object exists (for backwards compatibility)
      if (!parsed.pitchKit) {
        parsed.pitchKit = {};
      }
      return parsed;
    }
  } catch {
    // Invalid data, use defaults
  }
  
  return getDefaultData();
};

const saveToStorage = (data: PitchData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.error('Failed to save to localStorage');
  }
};

export function usePitchStore() {
  const [data, setData] = useState<PitchData>(loadFromStorage);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load from localStorage on mount
  useEffect(() => {
    setData(loadFromStorage());
  }, []);

  const setUserInfo = useCallback((userName: string, startupName: string) => {
    setSaveStatus('saving');
    setData(prev => {
      const updated = { ...prev, userName, startupName, updatedAt: new Date().toISOString() };
      saveToStorage(updated);
      return updated;
    });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, []);

  const setBlockContent = useCallback((blockNumber: number, content: string) => {
    setSaveStatus('saving');
    setData(prev => {
      const newBlocks = { ...prev.blocks, [blockNumber]: content };
      // Mark section as completed when block is saved with content
      const newSections = { ...prev.sections };
      if (content.trim().length > 0) {
        newSections[blockNumber] = {
          ...(newSections[blockNumber] || getDefaultSectionData()),
          completado: true,
        };
      }
      const updated = { ...prev, blocks: newBlocks, sections: newSections, updatedAt: new Date().toISOString() };
      saveToStorage(updated);
      return updated;
    });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, []);

  const setCurrentBlock = useCallback((blockNumber: number) => {
    setData(prev => {
      const updated = { ...prev, currentBlock: blockNumber, updatedAt: new Date().toISOString() };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  // New: Set exercise data for a specific section and exercise
  const setExerciseData = useCallback((sectionNumber: number, exerciseId: string, fieldData: ExerciseData) => {
    setSaveStatus('saving');
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
      saveToStorage(updated);
      return updated;
    });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, []);

  // New: Set current step for a section
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
      const updated = { ...prev, sections: newSections, updatedAt: new Date().toISOString() };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  // New: Get exercise data for a specific section
  const getSectionExercises = useCallback((sectionNumber: number): Record<string, ExerciseData> => {
    return data.sections[sectionNumber]?.exercises || {};
  }, [data.sections]);

  // New: Get current step for a section
  const getSectionStep = useCallback((sectionNumber: number): number => {
    return data.sections[sectionNumber]?.currentStep || 0;
  }, [data.sections]);

  // New: Get protagonist data from section 1 (for use in other sections)
  const getProtagonistData = useCallback(() => {
    const section1Exercises = data.sections[1]?.exercises || {};
    const protagonistExercise = section1Exercises['1_2'] || {};
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

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(getDefaultData());
  }, []);

  // Pitch Kit functions
  const saveToPitchKit = useCallback((blockNumber: number, content: string) => {
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setSaveStatus('saving');
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
      saveToStorage(updated);
      return updated;
    });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, []);

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
