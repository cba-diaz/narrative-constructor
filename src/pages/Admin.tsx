import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Film, 
  ArrowLeft, 
  Users, 
  FileText, 
  Calendar,
  User,
  Building,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PitchData {
  id: string;
  user_id: string;
  user_name: string;
  startup_name: string;
  current_block: number;
  created_at: string;
  updated_at: string;
  blocks: Record<string, unknown>;
  pitch_kit: Record<string, unknown>;
}

interface Profile {
  user_id: string;
  full_name: string | null;
  email: string | null;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [pitches, setPitches] = useState<PitchData[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin && user) {
      navigate('/');
    }
  }, [isAdmin, roleLoading, user, navigate]);

  useEffect(() => {
    async function fetchData() {
      if (!isAdmin) return;

      setLoading(true);

      const [pitchesRes, profilesRes] = await Promise.all([
        supabase.from('pitch_data').select('*').order('updated_at', { ascending: false }),
        supabase.from('profiles').select('user_id, full_name, email')
      ]);

      if (pitchesRes.data) {
        setPitches(pitchesRes.data as PitchData[]);
      }
      if (profilesRes.data) {
        setProfiles(profilesRes.data);
      }

      setLoading(false);
    }

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const getProfileByUserId = (userId: string) => {
    return profiles.find(p => p.user_id === userId);
  };

  const countCompletedBlocks = (pitchKit: Record<string, unknown>) => {
    return Object.values(pitchKit).filter(block => 
      block && typeof block === 'object' && 'content' in block && (block as { content: string }).content?.trim()
    ).length;
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Film className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Panel de Administración</h1>
                  <p className="text-sm text-muted-foreground">Gestión de pitches</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <ShieldCheck className="w-3 h-3" />
              Admin
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profiles.length}</p>
                  <p className="text-sm text-muted-foreground">Usuarios</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pitches.length}</p>
                  <p className="text-sm text-muted-foreground">Pitches</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {pitches.filter(p => countCompletedBlocks(p.pitch_kit as Record<string, unknown>) === 9).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pitches completos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pitches List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Todos los Pitches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : pitches.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay pitches registrados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pitches.map(pitch => {
                  const profile = getProfileByUserId(pitch.user_id);
                  const completedBlocks = countCompletedBlocks(pitch.pitch_kit as Record<string, unknown>);
                  
                  return (
                    <div 
                      key={pitch.id} 
                      className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Building className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-foreground">
                              {pitch.startup_name || 'Sin nombre de startup'}
                            </h3>
                            <Badge variant={completedBlocks === 9 ? 'default' : 'secondary'} className="ml-2">
                              {completedBlocks}/9 bloques
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {profile?.full_name || pitch.user_name || 'Usuario'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(pitch.updated_at), "d MMM yyyy, HH:mm", { locale: es })}
                            </span>
                          </div>
                          {profile?.email && (
                            <p className="text-xs text-muted-foreground mt-1">{profile.email}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Bloque actual: {pitch.current_block}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
