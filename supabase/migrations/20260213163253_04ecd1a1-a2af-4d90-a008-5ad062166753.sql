
-- Fix pitch_data: drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can view their own pitch data" ON public.pitch_data;
DROP POLICY IF EXISTS "Admins can view all pitch data" ON public.pitch_data;
DROP POLICY IF EXISTS "Users can create their own pitch data" ON public.pitch_data;
DROP POLICY IF EXISTS "Users can update their own pitch data" ON public.pitch_data;
DROP POLICY IF EXISTS "Users can delete their own pitch data" ON public.pitch_data;

CREATE POLICY "Users can view their own pitch data" ON public.pitch_data FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all pitch data" ON public.pitch_data FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create their own pitch data" ON public.pitch_data FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pitch data" ON public.pitch_data FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pitch data" ON public.pitch_data FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
