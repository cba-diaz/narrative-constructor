import { useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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

  // Derive view from URL — single source of truth
  const currentView = useMemo<View>(() => {
    const v = searchParams.get('view') as View | null;
    if (v && ['hub', 'editor', 'pitch'].includes(v)) return v;
    return 'landing';
  }, [searchParams]);

  const editingBlock = useMemo(() => {
    const s = searchParams.get('section');
    if (s) {
      const n = parseInt(s);
      if (n >= 1 && n <= 9) return n;
    }
    return 1;
  }, [searchParams]);

  // Navigate by updating URL params only
  const navigateTo = useCallback((view: View, section?: number) => {
    const params = new URLSearchParams();
    if (view !== 'landing') {
      params.set('view', view);
    }
    if (view === 'editor' && section) {
      params.set('section', section.toString());
    }
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Auto-redirect: if authenticated with data but on landing, go to hub
  useEffect(() => {
    if (authLoading || dataLoading) return;
    if (user && hasStarted && currentView === 'landing') {
      navigateTo('hub');
    }
  }, [authLoading, dataLoading, user, hasStarted, currentView, navigateTo]);

  // Redirect unauthenticated users away from protected views
  useEffect(() => {
    if (authLoading) return;
    if (!user && currentView !== 'landing') {
      navigateTo('landing');
    }
  }, [authLoading, user, currentView, navigateTo]);

  const handleStart = useCallback((userName: string, startupName: string) => {
    setUserInfo(userName, startupName);
    navigateTo('hub');
  }, [setUserInfo, navigateTo]);

  const handleSelectBlock = useCallback((blockNumber: number) => {
    setCurrentBlock(blockNumber);
    navigateTo('editor', blockNumber);
  }, [setCurrentBlock, navigateTo]);

  const handleReset = useCallback(() => {
    resetData();
    navigateTo('landing');
  }, [resetData, navigateTo]);

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
        pitchKitSavedBlocks={Object.keys(data.pitchKit).filter(k => data.pitchKit[parseInt(k)]?.content?.trim().length > 0).map(k => parseInt(k))}
        onSelectBlock={handleSelectBlock}
        onViewPitch={() => navigateTo('pitch')}
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
            navigateTo('pitch');
          } else {
            const nextBlock = editingBlock + 1;
            setCurrentBlock(nextBlock);
            navigateTo('editor', nextBlock);
          }
        }}
        onBack={() => navigateTo('hub')}
      />
    );
  }
  
  if (currentView === 'pitch') {
    return (
      <PitchView
        userName={data.userName}
        startupName={data.startupName}
        blockContents={data.blocks}
        onBack={() => navigateTo('hub')}
        onEditBlock={handleSelectBlock}
      />
    );
  }

  return null;
};

export default Index;
