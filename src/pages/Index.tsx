import { useState, useEffect, useCallback, useMemo } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { HubPage } from '@/components/HubPage';
import { SectionWizard } from '@/components/SectionWizard';
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
    getNextIncompleteBlock,
    resetData,
    hasStarted,
    getPitchKitCompletedCount,
  } = usePitchStore();

  const [currentView, setCurrentView] = useState<View>('landing');
  const [editingBlock, setEditingBlock] = useState<number>(1);

  // Initialize view based on stored data
  useEffect(() => {
    if (hasStarted) {
      setCurrentView('hub');
    } else {
      setCurrentView('landing');
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
    // Save the content first
    setBlockContent(editingBlock, content);
    
    // Calculate next block after this save
    // We need to manually check since state won't be updated yet
    const hasContent = content && content.trim().length > 0;
    
    if (editingBlock === 9) {
      // Last block - go to pitch view
      setCurrentView('pitch');
    } else if (hasContent) {
      // Content saved, go to next block
      const nextBlock = editingBlock + 1;
      setEditingBlock(nextBlock);
      setCurrentBlock(nextBlock);
    } else {
      // No content, stay on current block
      // Just saved empty, go back to hub
      setCurrentView('hub');
    }
  }, [editingBlock, setBlockContent, setCurrentBlock]);

  const handleReset = useCallback(() => {
    resetData();
    setCurrentView('landing');
    setEditingBlock(1);
  }, [resetData]);

  const currentBlockData = useMemo(() => 
    blocks.find(b => b.numero === editingBlock),
    [editingBlock]
  );
  
  const completedBlocks = getCompletedBlocks();

  if (currentView === 'landing') {
    return <LandingPage onStart={handleStart} />;
  }
  
  if (currentView === 'hub') {
    return (
      <HubPage
        userName={data.userName}
        startupName={data.startupName}
        completedBlocks={completedBlocks}
        currentBlock={data.currentBlock}
        pitchKitCount={getPitchKitCompletedCount()}
        onSelectBlock={handleSelectBlock}
        onViewPitch={() => setCurrentView('pitch')}
        onReset={handleReset}
      />
    );
  }
  
  if (currentView === 'editor') {
    return (
      <SectionWizard
        key={editingBlock}
        sectionNumber={editingBlock}
        onComplete={() => {
          if (editingBlock === 9) {
            setCurrentView('pitch');
          } else {
            const nextBlock = editingBlock + 1;
            setEditingBlock(nextBlock);
            setCurrentBlock(nextBlock);
          }
        }}
        onBack={() => setCurrentView('hub')}
      />
    );
  }
  
  if (currentView === 'pitch') {
    return (
      <PitchView
        userName={data.userName}
        startupName={data.startupName}
        blockContents={data.blocks}
        onBack={() => setCurrentView('hub')}
        onEditBlock={handleSelectBlock}
      />
    );
  }

  return null;
};

export default Index;
