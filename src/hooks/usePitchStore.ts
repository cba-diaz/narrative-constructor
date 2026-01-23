import { useState, useEffect, useCallback } from 'react';

export interface PitchData {
  userName: string;
  startupName: string;
  blocks: Record<number, string>;
  currentBlock: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'pitch-de-pelicula-data';

const getDefaultData = (): PitchData => ({
  userName: '',
  startupName: '',
  blocks: {},
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
      return JSON.parse(stored);
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
      const updated = { ...prev, blocks: newBlocks, updatedAt: new Date().toISOString() };
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

  const hasStarted = data.userName.length > 0 && data.startupName.length > 0;

  return {
    data,
    saveStatus,
    setUserInfo,
    setBlockContent,
    setCurrentBlock,
    getCompletedBlocks,
    isBlockCompleted,
    getNextIncompleteBlock,
    getTotalWords,
    resetData,
    hasStarted,
  };
}
