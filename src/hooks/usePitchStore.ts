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

const getInitialData = (): PitchData => {
  if (typeof window === 'undefined') {
    return {
      userName: '',
      startupName: '',
      blocks: {},
      currentBlock: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {
        userName: '',
        startupName: '',
        blocks: {},
        currentBlock: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }
  
  return {
    userName: '',
    startupName: '',
    blocks: {},
    currentBlock: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export function usePitchStore() {
  const [data, setData] = useState<PitchData>(getInitialData);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        // Invalid data, use defaults
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  const saveData = useCallback((newData: PitchData) => {
    setSaveStatus('saving');
    try {
      const updatedData = { ...newData, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      setData(updatedData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, []);

  const setUserInfo = useCallback((userName: string, startupName: string) => {
    saveData({ ...data, userName, startupName });
  }, [data, saveData]);

  const setBlockContent = useCallback((blockNumber: number, content: string) => {
    const newBlocks = { ...data.blocks, [blockNumber]: content };
    saveData({ ...data, blocks: newBlocks });
  }, [data, saveData]);

  const setCurrentBlock = useCallback((blockNumber: number) => {
    saveData({ ...data, currentBlock: blockNumber });
  }, [data, saveData]);

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
      if (!isBlockCompleted(i)) return i;
    }
    return null;
  }, [isBlockCompleted]);

  const getTotalWords = useCallback(() => {
    return Object.values(data.blocks)
      .join(' ')
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }, [data.blocks]);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData({
      userName: '',
      startupName: '',
      blocks: {},
      currentBlock: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
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
