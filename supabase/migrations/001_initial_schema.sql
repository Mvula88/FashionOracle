-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  style_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fashion Items table
CREATE TABLE public.fashion_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT,
  colors TEXT[],
  patterns TEXT[],
  materials TEXT[],
  price_range TEXT,
  season TEXT,
  gender TEXT,
  image_urls TEXT[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trends tracking table
CREATE TABLE public.trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.fashion_items(id) ON DELETE CASCADE,
  trend_score FLOAT NOT NULL,
  prediction_confidence FLOAT,
  current_status TEXT CHECK (current_status IN ('emerging', 'rising', 'trending', 'declining', 'faded')),
  predicted_peak_date TIMESTAMP WITH TIME ZONE,
  actual_peak_date TIMESTAMP WITH TIME ZONE,
  geographic_origin TEXT,
  target_demographics JSONB,
  social_mentions INTEGER DEFAULT 0,
  engagement_rate FLOAT,
  influencer_adoptions INTEGER DEFAULT 0,
  retail_availability JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media posts tracking
CREATE TABLE public.social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  post_id TEXT NOT NULL,
  user_id TEXT,
  username TEXT,
  follower_count INTEGER,
  content TEXT,
  image_urls TEXT[],
  hashtags TEXT[],
  mentions INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  engagement_rate FLOAT,
  posted_at TIMESTAMP WITH TIME ZONE,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  detected_items UUID[]
);

-- User interactions table
CREATE TABLE public.user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.fashion_items(id) ON DELETE CASCADE,
  interaction_type TEXT CHECK (interaction_type IN ('view', 'like', 'save', 'share', 'click_buy', 'purchase')),
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trend predictions table
CREATE TABLE public.trend_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.fashion_items(id) ON DELETE CASCADE,
  prediction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  predicted_trend_start TIMESTAMP WITH TIME ZONE,
  predicted_peak TIMESTAMP WITH TIME ZONE,
  predicted_decline TIMESTAMP WITH TIME ZONE,
  confidence_score FLOAT,
  geographic_markets TEXT[],
  target_audience JSONB,
  prediction_factors JSONB,
  actual_outcome TEXT,
  created_by TEXT DEFAULT 'ai_model'
);

-- B2B Clients table
CREATE TABLE public.b2b_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  subscription_tier TEXT CHECK (subscription_tier IN ('basic', 'premium', 'enterprise')),
  api_key TEXT UNIQUE,
  monthly_request_limit INTEGER,
  current_usage INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search history table
CREATE TABLE public.search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  search_query TEXT,
  search_type TEXT CHECK (search_type IN ('text', 'image', 'visual')),
  results_found INTEGER,
  clicked_items UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_trends_score ON public.trends(trend_score DESC);
CREATE INDEX idx_trends_status ON public.trends(current_status);
CREATE INDEX idx_trends_date ON public.trends(predicted_peak_date);
CREATE INDEX idx_fashion_items_category ON public.fashion_items(category);
CREATE INDEX idx_social_posts_platform ON public.social_posts(platform);
CREATE INDEX idx_social_posts_date ON public.social_posts(posted_at DESC);
CREATE INDEX idx_user_interactions_user ON public.user_interactions(user_id);
CREATE INDEX idx_user_interactions_item ON public.user_interactions(item_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fashion_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Profiles: Users can view all profiles but only edit their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Fashion items: Viewable by everyone
CREATE POLICY "Fashion items are viewable by everyone" ON public.fashion_items
  FOR SELECT USING (true);

-- Trends: Viewable by everyone
CREATE POLICY "Trends are viewable by everyone" ON public.trends
  FOR SELECT USING (true);

-- User interactions: Users can only see and create their own
CREATE POLICY "Users can view own interactions" ON public.user_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions" ON public.user_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Search history: Users can only see their own
CREATE POLICY "Users can view own search history" ON public.search_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history" ON public.search_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers for tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fashion_items_updated_at BEFORE UPDATE ON public.fashion_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trends_updated_at BEFORE UPDATE ON public.trends
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_b2b_clients_updated_at BEFORE UPDATE ON public.b2b_clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();