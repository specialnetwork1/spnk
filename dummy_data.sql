-- FF HUB DATABASE SETUP
--
-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard.
-- 2. Navigate to the "SQL Editor".
-- 3. Click "+ New query".
-- 4. Copy and paste the entire content of this file into the editor.
-- 5. Click "RUN".
-- 6. Follow the instructions in SETUP_INSTRUCTIONS.md to create demo users.
--

-- 1. CREATE TABLES

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    "inGameName" text NOT NULL,
    "playerUID" text NOT NULL,
    "walletBalance" numeric NOT NULL DEFAULT 0,
    "isAdmin" boolean NOT NULL DEFAULT false,
    "joinedTournaments" uuid[] NOT NULL DEFAULT '{}',
    "readNotificationIds" uuid[] NOT NULL DEFAULT '{}',
    "registrationDate" timestamp with time zone DEFAULT now() NOT NULL,
    "avatarUrl" text,
    socials jsonb
);

-- Tournaments Table
CREATE TABLE IF NOT EXISTS public.tournaments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL, -- Corresponds to TournamentType enum
    "entryFee" numeric NOT NULL,
    "prizePool" numeric NOT NULL,
    "mapName" text NOT NULL,
    "startTime" timestamp with time zone NOT NULL,
    "maxPlayers" integer NOT NULL,
    participants uuid[] NOT NULL DEFAULT '{}',
    "imageUrl" text,
    "roomDetails" jsonb
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "userId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount numeric NOT NULL,
    "senderNumber" text,
    "trxId" text,
    status text NOT NULL, -- Corresponds to TransactionStatus enum
    date timestamp with time zone DEFAULT now() NOT NULL
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    message text NOT NULL,
    date timestamp with time zone DEFAULT now() NOT NULL
);

-- App Settings Table
CREATE TABLE IF NOT EXISTS public.app_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "appName" text NOT NULL,
    "appLogoUrl" text,
    "marqueeText" text,
    "paymentGateways" jsonb,
    theme jsonb
);

-- 2. HELPER FUNCTIONS
-- This function checks if the current user is an admin.
-- It is defined with SECURITY DEFINER to bypass RLS checks and prevent infinite recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND "isAdmin" = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. ROW LEVEL SECURITY (RLS)

-- Enable RLS for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'users'
CREATE POLICY "Users can view their own profile." ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can manage all user profiles." ON public.users FOR ALL USING ( public.is_admin() );

-- RLS Policies for 'tournaments'
CREATE POLICY "Anyone can view tournaments." ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Admins can manage tournaments." ON public.tournaments FOR ALL USING ( public.is_admin() );
CREATE POLICY "Authenticated users can join tournaments by updating participants." ON public.tournaments FOR UPDATE USING ( auth.role() = 'authenticated' );

-- RLS Policies for 'transactions'
CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users can create their own transactions." ON public.transactions FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Admins can manage all transactions." ON public.transactions FOR ALL USING ( public.is_admin() );

-- RLS Policies for 'notifications'
CREATE POLICY "Authenticated users can view notifications." ON public.notifications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can create notifications." ON public.notifications FOR INSERT WITH CHECK ( public.is_admin() );

-- RLS Policies for 'app_settings'
CREATE POLICY "Anyone can view app settings." ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update app settings." ON public.app_settings FOR ALL USING ( public.is_admin() );


-- 4. AUTOMATIC USER PROFILE CREATION TRIGGER

-- Drop existing function and trigger to ensure a clean setup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a function to insert a new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, "inGameName", "playerUID")
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New Player'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'inGameName', 'Player_' || substring(NEW.id::text, 1, 5)),
    COALESCE(NEW.raw_user_meta_data->>'playerUID', '000000')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function on new user sign-up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 5. INITIAL DATA

-- Insert default app settings
-- This ensures the app doesn't crash on first load if settings haven't been configured by an admin yet.
INSERT INTO public.app_settings (id, "appName", theme, "paymentGateways", "marqueeText", "appLogoUrl")
VALUES
(
    'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    'FF HUB',
    '{
        "colors": {
            "primary": "#EF4444",
            "textPrimary": "#111827",
            "textSecondary": "#6B7280",
            "background": "#F9FAFB"
        },
        "fonts": {
            "heading": "''Orbitron'', sans-serif",
            "body": "''Rajdhani'', sans-serif"
        }
    }',
    '[
        {"name": "bKash", "enabled": true, "logoUrl": "https://seeklogo.com/images/B/bkash-logo-FBB25873C6-seeklogo.com.png", "apiKey": "", "secretKey": "", "username": "", "password": ""},
        {"name": "Nagad", "enabled": true, "logoUrl": "https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png", "apiKey": "", "secretKey": "", "username": "", "password": ""},
        {"name": "Rocket", "enabled": false, "logoUrl": "https://seeklogo.com/images/R/rocket-logo-622E42682C-seeklogo.com.png", "apiKey": "", "secretKey": "", "username": "", "password": ""},
        {"name": "Upay", "enabled": false, "logoUrl": "https://seeklogo.com/images/U/upay-logo-A95A475591-seeklogo.com.png", "apiKey": "", "secretKey": "", "username": "", "password": ""}
    ]',
    'Welcome to FF HUB! The ultimate destination for Free Fire tournaments. Register now and compete for glory!',
    ''
) ON CONFLICT (id) DO NOTHING;

-- Provide a success message in the Supabase console
SELECT 'Successfully set up database schema, RLS policies, and triggers.';