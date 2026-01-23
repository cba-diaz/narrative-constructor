import { useState, useEffect, useCallback } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { HubPage } from '@/components/HubPage';
import { BlockEditor } from '@/components/BlockEditor';
import { PitchView } from '@/components/PitchView';
import { blocks } from '@/data/blocks';
import { usePitchStore } from '@/hooks/usePitchStore';

type View = 'landing' | 'hub' | 'editor' | 'pitch';

const Index = () => {
  const {
    data,
    setUserInfo,
    setBlockContent,
    setCurrentBlock,
    getCompletedBlocks,
    isBlockCompleted,
    getNextIncompleteBlock,
    resetData,
    hasStarted,
  } = usePitchStore();

  const [currentView, setCurrentView] = useState<View>('landing');
  const [editingBlock, setEditingBlock] = useState<number>(1);

  // Initialize view based on stored data
  useEffect(() => {
    if (hasStarted) {
      setCurrentView('hub');
    }
  }, [hasStarted]);

  // Warn before closing with unsaved data
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasStarted) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasStarted]);

  const handleStart = useCallback((userName: string, startupName: string) => {
    setUserInfo(userName, startupName);
    setCurrentView('hub');
  }, [setUserInfo]);

  const handleSelectBlock = useCallback((blockNumber: number) => {
    setEditingBlock(blockNumber);
    setCurrentBlock(blockNumber);
    setCurrentView('editor');
  }, [setCurrentBlock]);

  const handleSaveBlock = useCallback((content: string) => {
    setBlockContent(editingBlock, content);
  }, [editingBlock, setBlockContent]);

  const handleSaveAndContinue = useCallback((content: string) => {
    setBlockContent(editingBlock, content);
    
    // Find next incomplete block or go to hub if all complete
    const nextBlock = getNextIncompleteBlock();
    
    if (editingBlock === 9 || !nextBlock) {
      // Last block or all complete - go to pitch view
      setCurrentView('pitch');
    } else {
      // Go to next block
      setEditingBlock(nextBlock);
      setCurrentBlock(nextBlock);
    }
  }, [editingBlock, setBlockContent, getNextIncompleteBlock, setCurrentBlock]);

  const handleReset = useCallback(() => {
    resetData();
    setCurrentView('landing');
    setEditingBlock(1);
  }, [resetData]);

  const currentBlockData = blocks.find(b => b.numero === editingBlock);
  const completedBlocks = getCompletedBlocks();

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage onStart={handleStart} />
      )}
      
      {currentView === 'hub' && (
        <HubPage
          userName={data.userName}
          startupName={data.startupName}
          completedBlocks={completedBlocks}
          currentBlock={data.currentBlock}
          onSelectBlock={handleSelectBlock}
          onViewPitch={() => setCurrentView('pitch')}
          onReset={handleReset}
        />
      )}
      
      {currentView === 'editor' && currentBlockData && (
        <BlockEditor
          block={currentBlockData}
          initialContent={data.blocks[editingBlock] || ''}
          onSave={handleSaveBlock}
          onSaveAndContinue={handleSaveAndContinue}
          onBack={() => setCurrentView('hub')}
          isLastBlock={editingBlock === 9}
        />
      )}
      
      {currentView === 'pitch' && (
        <PitchView
          userName={data.userName}
          startupName={data.startupName}
          blockContents={data.blocks}
          onBack={() => setCurrentView('hub')}
          onEditBlock={handleSelectBlock}
        />
      )}
    </>
  );
};

export default Index;
