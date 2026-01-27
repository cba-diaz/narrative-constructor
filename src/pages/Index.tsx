import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPage } from '@/components/LandingPage';
import { HubPage } from '@/components/HubPage';
import { SectionWizard } from '@/components/SectionWizard';
import { PitchView } from '@/components/PitchView';
import { blocks } from '@/data/blocks';
import { usePitchStore } from '@/hooks/usePitchStore';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type View = 'landing' | 'hub' | 'editor' | 'pitch';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    data,
    isLoading: dataLoading,
    setUserInfo,
    setBlockContent,
    setCurrentBlock,
    getCompletedBlocks,
    resetData,
    hasStarted,
    getPitchKitCompletedCount,
  } = usePitchStore();

  const [currentView, setCurrentView] = useState<View>('landing');
  const [editingBlock, setEditingBlock] = useState<number>(1);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      // User is not logged in, show landing which will redirect to login
      setCurrentView('landing');
    }
  }, [authLoading, user]);

  // Initialize view based on stored data
  useEffect(() => {
    if (authLoading || dataLoading) return;
    
    if (user && hasStarted) {
      setCurrentView('hub');
    } else if (user) {
      setCurrentView('landing');
    }
  }, [authLoading, dataLoading, user, hasStarted]);

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
    
    const hasContent = content && content.trim().length > 0;
    
    if (editingBlock === 9) {
      setCurrentView('pitch');
    } else if (hasContent) {
      const nextBlock = editingBlock + 1;
      setEditingBlock(nextBlock);
      setCurrentBlock(nextBlock);
    } else {
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

  // Show loading while auth or data is loading
  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tu pitch...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users or authenticated users without data
  if (currentView === 'landing') {
    return <LandingPage onStart={handleStart} isAuthenticated={!!user} />;
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
