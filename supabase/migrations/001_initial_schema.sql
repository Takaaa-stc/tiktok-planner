-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'light', 'pro')),
  generation_count integer not null default 0,
  created_at timestamp with time zone default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- generations table
create table if not exists public.generations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  image_url text,
  subject text,
  unit text,
  title text,
  mode text not null default 'detailed',
  ai_result jsonb,
  pdf_url text,
  created_at timestamp with time zone default now() not null
);

alter table public.generations enable row level security;

create policy "Users can view their own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generations"
  on public.generations for insert
  with check (auth.uid() = user_id);

create index generations_user_id_idx on public.generations(user_id);
create index generations_created_at_idx on public.generations(created_at desc);

-- subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free',
  status text not null default 'active',
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  unique(user_id)
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- usage_logs table
create table if not exists public.usage_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  created_at timestamp with time zone default now() not null
);

alter table public.usage_logs enable row level security;

create policy "Users can view their own usage logs"
  on public.usage_logs for select
  using (auth.uid() = user_id);

create index usage_logs_user_id_idx on public.usage_logs(user_id);
create index usage_logs_created_at_idx on public.usage_logs(created_at desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- RPC to safely increment generation count
create or replace function public.increment_generation_count(user_id uuid)
returns void as $$
  update public.profiles
  set generation_count = generation_count + 1
  where id = user_id;
$$ language sql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket for problem images
insert into storage.buckets (id, name, public)
values ('problem-images', 'problem-images', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (bucket_id = 'problem-images' and auth.role() = 'authenticated');

create policy "Public read access for images"
  on storage.objects for select
  using (bucket_id = 'problem-images');

create policy "Users can delete their own images"
  on storage.objects for delete
  using (bucket_id = 'problem-images' and auth.uid()::text = (storage.foldername(name))[1]);
