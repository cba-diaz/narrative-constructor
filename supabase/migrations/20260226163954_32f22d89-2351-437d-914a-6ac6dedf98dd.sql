
-- Drop and recreate ALL policies as PERMISSIVE for pitch_data
DROP POLICY IF EXISTS "Users can view their own pitch data" ON public.pitch_data;
DROP POLICY IF EXISTS "Admins can view all pitch data" ON public.pitch_data;
DROP POLICY IF EXISTS "Users can create their own pitch data" ON public.pitch_data;
DROP POLICY IF EXISTS "Users can update their own pitch data" ON public.pitch_data;
DROP POLICY IF EXISTS "Users can delete their own pitch data" ON public.pitch_data;

CREATE POLICY "Users can view own pitch data" ON public.pitch_data AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all pitch data" ON public.pitch_data AS PERMISSIVE FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create own pitch data" ON public.pitch_data AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pitch data" ON public.pitch_data AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pitch data" ON public.pitch_data AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Drop and recreate ALL policies as PERMISSIVE for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles AS PERMISSIVE FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own profile" ON public.profiles AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Drop and recreate ALL policies as PERMISSIVE for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
