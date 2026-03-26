-- =============================================
-- dotignore — Initial Database Schema
-- =============================================
-- Supabase Dashboard → SQL Editor'den çalıştır

-- 1. Users tablosu (auth.users ile senkronize)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now()
);

-- RLS aktif et
alter table public.users enable row level security;

-- Kullanıcı sadece kendi verisini görsün
create policy "Users can view own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own data"
  on public.users for update
  using (auth.uid() = id);

-- 2. API Keys tablosu
create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  hashed_key text not null unique,
  key_prefix text not null,          -- "dk_abc1..." ilk 8 karakter (UI'da göstermek için)
  label text not null default 'Default',
  usage_count integer not null default 0,
  usage_limit integer,               -- null = sınırsız
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

-- RLS aktif et
alter table public.api_keys enable row level security;

-- Kullanıcı sadece kendi key'lerini görsün
create policy "Users can view own API keys"
  on public.api_keys for select
  using (auth.uid() = user_id);

create policy "Users can insert own API keys"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own API keys"
  on public.api_keys for delete
  using (auth.uid() = user_id);

create policy "Users can update own API keys"
  on public.api_keys for update
  using (auth.uid() = user_id);

-- 3. Usage Logs tablosu (rate limiting için)
create table public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  ip_address text not null,
  endpoint text not null,
  created_at timestamptz not null default now()
);

-- RLS aktif et
alter table public.usage_logs enable row level security;

-- Usage logs sadece service_role ile erişilebilir (RLS policy yok = anonim erişim engellenir)
-- Server-side API routes service_role key ile yazacak

-- 4. Index'ler (performans)
create index idx_api_keys_hashed_key on public.api_keys(hashed_key);
create index idx_api_keys_user_id on public.api_keys(user_id);
create index idx_usage_logs_ip_endpoint on public.usage_logs(ip_address, endpoint, created_at);
create index idx_usage_logs_created_at on public.usage_logs(created_at);

-- 5. Auth trigger: yeni kullanıcı kaydolduğunda public.users'a otomatik ekle
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
