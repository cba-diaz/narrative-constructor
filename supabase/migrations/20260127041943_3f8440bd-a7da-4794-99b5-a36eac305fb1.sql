-- Create pitch_data table to store all pitch-related data per user
CREATE TABLE public.pitch_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT '',
  startup_name TEXT NOT NULL DEFAULT '',
  blocks JSONB NOT NULL DEFAULT '{}'::jsonb,
  sections JSONB NOT NULL DEFAULT '{}'::jsonb,
  pitch_kit JSONB NOT NULL DEFAULT '{}'::jsonb,
  current_block INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.pitch_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own pitch data" 
ON public.pitch_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pitch data" 
ON public.pitch_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pitch data" 
ON public.pitch_data 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pitch data" 
ON public.pitch_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pitch_data_updated_at
BEFORE UPDATE ON public.pitch_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();