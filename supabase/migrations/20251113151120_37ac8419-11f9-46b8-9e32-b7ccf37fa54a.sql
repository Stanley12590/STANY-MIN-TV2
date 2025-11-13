-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create movies table
CREATE TABLE public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  description TEXT,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 10),
  release_year INTEGER,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  watch_link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create live_channels table
CREATE TABLE public.live_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  watch_link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create banners table
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  target_movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE,
  target_channel_id UUID REFERENCES public.live_channels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK ((target_movie_id IS NOT NULL AND target_channel_id IS NULL) OR 
         (target_movie_id IS NULL AND target_channel_id IS NOT NULL))
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data ->> 'username');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read access for content
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view movies"
  ON public.movies FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view channels"
  ON public.live_channels FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view banners"
  ON public.banners FOR SELECT
  USING (true);

-- Admin-only write access
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage movies"
  ON public.movies FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage channels"
  ON public.live_channels FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage banners"
  ON public.banners FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profile policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Roles policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));