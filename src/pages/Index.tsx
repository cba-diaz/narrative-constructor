import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Get view and section from URL params for persistence
  const urlView = searchParams.get('view') as View | null;
  const urlSection = searchParams.get('section');
  
  const [currentView, setCurrentView] = useState<View>(() => {
    if (urlView && ['landing', 'hub', 'editor', 'pitch'].includes(urlView)) {
      return urlView;
    }
    return 'landing';
  });
  
  const [editingBlock, setEditingBlock] = useState<number>(() => {
    const section = urlSection ? parseInt(urlSection) : 1;
    return section >= 1 && section <= 9 ? section : 1;
  });

  // Update URL when view/section changes
  const updateUrl = useCallback((view: View, section?: number) => {
    const params = new URLSearchParams();
    if (view !== 'landing') {
      params.set('view', view);
    }
    if (view === 'editor' && section) {
      params.set('section', section.toString());
    }
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Sync currentView with URL updates
  const handleSetView = useCallback((view: View, section?: number) => {
    setCurrentView(view);
    updateUrl(view, section);
  }, [updateUrl]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      handleSetView('landing');
    }
  }, [authLoading, user, handleSetView]);

  // Initialize view based on stored data and URL
  useEffect(() => {
    if (authLoading || dataLoading) return;
    
    if (user && hasStarted) {
      // If URL has a valid view, use it; otherwise default to hub
      if (!urlView || !['hub', 'editor', 'pitch'].includes(urlView)) {
        handleSetView('hub');
      } else if (urlView === 'editor' && urlSection) {
        const section = parseInt(urlSection);
        if (section >= 1 && section <= 9) {
          setEditingBlock(section);
          setCurrentBlock(section);
        }
      }
    } else if (user) {
      handleSetView('landing');
    }
  }, [authLoading, dataLoading, user, hasStarted, urlView, urlSection, handleSetView, setCurrentBlock]);

  const handleStart = useCallback((userName: string, startupName: string) => {
    setUserInfo(userName, startupName);
    handleSetView('hub');
  }, [setUserInfo, handleSetView]);

  const handleSelectBlock = useCallback((blockNumber: number) => {
    setEditingBlock(blockNumber);
    setCurrentBlock(blockNumber);
    handleSetView('editor', blockNumber);
  }, [setCurrentBlock, handleSetView]);

  const handleSaveBlock = useCallback((content: string) => {
    setBlockContent(editingBlock, content);
  }, [editingBlock, setBlockContent]);

  const handleSaveAndContinue = useCallback((content: string) => {
    setBlockContent(editingBlock, content);
    
    const hasContent = content && content.trim().length > 0;
    
    if (editingBlock === 9) {
      handleSetView('pitch');
    } else if (hasContent) {
      const nextBlock = editingBlock + 1;
      setEditingBlock(nextBlock);
      setCurrentBlock(nextBlock);
      handleSetView('editor', nextBlock);
    } else {
      handleSetView('hub');
    }
  }, [editingBlock, setBlockContent, setCurrentBlock, handleSetView]);

  const handleReset = useCallback(() => {
    resetData();
    handleSetView('landing');
    setEditingBlock(1);
  }, [resetData, handleSetView]);

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
        onViewPitch={() => handleSetView('pitch')}
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
            handleSetView('pitch');
          } else {
            const nextBlock = editingBlock + 1;
            setEditingBlock(nextBlock);
            setCurrentBlock(nextBlock);
            handleSetView('editor', nextBlock);
          }
        }}
        onBack={() => handleSetView('hub')}
      />
    );
  }
  
  if (currentView === 'pitch') {
    return (
      <PitchView
        userName={data.userName}
        startupName={data.startupName}
        blockContents={data.blocks}
        onBack={() => handleSetView('hub')}
        onEditBlock={handleSelectBlock}
      />
    );
  }

  return null;
};

export default Index;
