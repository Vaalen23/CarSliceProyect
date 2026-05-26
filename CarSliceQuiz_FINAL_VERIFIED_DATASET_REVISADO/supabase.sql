-- CARSLICE QUIZ - SUPABASE SQL COMPLETO
-- Ejecuta TODO este archivo en Supabase > SQL Editor > New Query > Run.
-- No borra tus datos existentes.

create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text unique not null,
  password text not null,
  puntos integer default 0,
  racha_max integer default 0,
  created_at timestamp default now(),
  stats jsonb default '{"games":0,"correct":0,"total":0,"bestScore":0,"titles":["Turbo Kid"],"collection":[],"achievements":[],"favorites":[],"history":[],"modeStats":{}}'::jsonb
);

create table if not exists partidas (
  id uuid primary key default gen_random_uuid(),
  usuario text not null,
  puntos integer default 0,
  racha integer default 0,
  fecha timestamp default now(),
  modo text default 'classic',
  daily_id text
);

alter table usuarios add column if not exists password text;
alter table usuarios add column if not exists puntos integer default 0;
alter table usuarios add column if not exists racha_max integer default 0;
alter table usuarios add column if not exists stats jsonb default '{"games":0,"correct":0,"total":0,"bestScore":0,"titles":["Turbo Kid"],"collection":[],"achievements":[],"favorites":[],"history":[],"modeStats":{}}'::jsonb;

alter table partidas add column if not exists modo text default 'classic';
alter table partidas add column if not exists daily_id text;

alter table usuarios enable row level security;
alter table partidas enable row level security;

drop policy if exists usuarios_insert on usuarios;
drop policy if exists usuarios_select on usuarios;
drop policy if exists usuarios_update on usuarios;
drop policy if exists partidas_insert on partidas;
drop policy if exists partidas_select on partidas;

create policy usuarios_insert on usuarios
for insert to anon
with check (true);

create policy usuarios_select on usuarios
for select to anon
using (true);

create policy usuarios_update on usuarios
for update to anon
using (true)
with check (true);

create policy partidas_insert on partidas
for insert to anon
with check (true);

create policy partidas_select on partidas
for select to anon
using (true);

-- Opcional para comprobar que existe todo:
select 'usuarios ok' as tabla, count(*) as registros from usuarios
union all
select 'partidas ok' as tabla, count(*) as registros from partidas;
