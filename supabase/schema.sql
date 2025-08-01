-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT,
  stripe_customer_id TEXT,
  plan_details JSONB DEFAULT '{
    "planId": "free",
    "maxPrints": 20,
    "maxComputers": 1,
    "monthlyPrintCount": 0,
    "billingCycleStart": "2025-01-01T00:00:00Z"
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create computers table
CREATE TABLE public.computers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  computer_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('online', 'offline')) DEFAULT 'offline',
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create print_jobs table
CREATE TABLE public.print_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  printer_id TEXT NOT NULL,
  computer_id UUID REFERENCES public.computers(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'printing', 'completed', 'error')) DEFAULT 'pending',
  file_storage_path TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create api_keys table
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.computers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- RLS Policies for computers table
CREATE POLICY "Users can manage own computers" ON public.computers
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for print_jobs table
CREATE POLICY "Users can create own print jobs" ON public.print_jobs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own print jobs" ON public.print_jobs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own print jobs" ON public.print_jobs
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for api_keys table
CREATE POLICY "Users can manage own API keys" ON public.api_keys
  FOR ALL USING (user_id = auth.uid());

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    company_name,
    plan_details
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
    '{
      "planId": "free",
      "maxPrints": 20,
      "maxComputers": 1,
      "monthlyPrintCount": 0,
      "billingCycleStart": "' || NOW() || '"
    }'::jsonb
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to increment print count
CREATE OR REPLACE FUNCTION public.increment_print_count(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users 
  SET plan_details = jsonb_set(
    plan_details, 
    '{monthlyPrintCount}', 
    (COALESCE((plan_details->>'monthlyPrintCount')::int, 0) + 1)::text::jsonb
  )
  WHERE id = user_id;
END;
$$;

-- Function to upgrade user plan
CREATE OR REPLACE FUNCTION public.upgrade_user_plan(customer_id TEXT, new_plan TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  plan_config JSONB;
BEGIN
  -- Define plan configurations
  CASE new_plan
    WHEN 'pro' THEN
      plan_config := '{
        "planId": "pro",
        "maxPrints": 500,
        "maxComputers": 5,
        "monthlyPrintCount": 0,
        "billingCycleStart": "' || NOW() || '"
      }'::jsonb;
    WHEN 'enterprise' THEN
      plan_config := '{
        "planId": "enterprise",
        "maxPrints": 2000,
        "maxComputers": 20,
        "monthlyPrintCount": 0,
        "billingCycleStart": "' || NOW() || '"
      }'::jsonb;
    ELSE
      plan_config := '{
        "planId": "free",
        "maxPrints": 20,
        "maxComputers": 1,
        "monthlyPrintCount": 0,
        "billingCycleStart": "' || NOW() || '"
      }'::jsonb;
  END CASE;

  -- Update user plan
  UPDATE public.users 
  SET plan_details = plan_config,
      stripe_customer_id = customer_id
  WHERE stripe_customer_id = customer_id;
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_computers_user_id ON public.computers(user_id);
CREATE INDEX idx_computers_status ON public.computers(status);
CREATE INDEX idx_print_jobs_user_id ON public.print_jobs(user_id);
CREATE INDEX idx_print_jobs_status ON public.print_jobs(status);
CREATE INDEX idx_print_jobs_created_at ON public.print_jobs(created_at DESC);
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON public.api_keys(key_hash); 