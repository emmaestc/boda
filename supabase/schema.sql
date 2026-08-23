-- =====================================================================
--  Johana & Emmanuel — esquema de invitados
--  Ejecutable tal cual en el SQL Editor de Supabase. Es idempotente:
--  se puede volver a correr sin romper nada.
-- =====================================================================

-- ---------- Tipos ----------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'estado_confirmacion') then
    create type estado_confirmacion as enum ('pendiente', 'confirmado', 'no_asiste');
  end if;
  if not exists (select 1 from pg_type where typname = 'restriccion_alimentaria') then
    create type restriccion_alimentaria as enum ('ninguna', 'vegetariano', 'vegano', 'otra');
  end if;
end
$$;

-- ---------- Invitados ------------------------------------------------

create table if not exists public.guests (
  id                            uuid primary key default gen_random_uuid(),
  nombre                        text not null,
  codigo_invitacion             text not null unique,
  telefono                      text,
  grupo                         text,
  cantidad_personas_permitidas  smallint not null default 1,
  estado_confirmacion           estado_confirmacion not null default 'pendiente',
  cantidad_asistentes           smallint not null default 0,
  restriccion_alimentaria       restriccion_alimentaria not null default 'ninguna',
  restriccion_detalle           text,
  comentario                    text,
  fecha_confirmacion            timestamptz,
  -- Saber quién ya abrió su invitación y aún no responde vale oro
  -- en las dos semanas previas a la boda.
  primera_apertura_at           timestamptz,
  aperturas                     integer not null default 0,
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now(),

  constraint guests_nombre_no_vacio
    check (char_length(btrim(nombre)) between 2 and 120),
  constraint guests_codigo_formato
    check (codigo_invitacion ~ '^[A-Z0-9]{6,16}$'),
  constraint guests_cupo_valido
    check (cantidad_personas_permitidas between 1 and 20),
  constraint guests_asistentes_no_negativos
    check (cantidad_asistentes >= 0),
  -- La regla de negocio más importante, garantizada por la base de datos
  -- y no solo por la aplicación.
  constraint guests_asistentes_dentro_del_cupo
    check (cantidad_asistentes <= cantidad_personas_permitidas),
  constraint guests_confirmado_trae_gente
    check (estado_confirmacion <> 'confirmado' or cantidad_asistentes >= 1),
  constraint guests_detalle_solo_si_otra
    check (restriccion_alimentaria = 'otra' or restriccion_detalle is null),
  constraint guests_comentario_acotado
    check (comentario is null or char_length(comentario) <= 500),
  constraint guests_detalle_acotado
    check (restriccion_detalle is null or char_length(restriccion_detalle) <= 120)
);

create index if not exists guests_estado_idx  on public.guests (estado_confirmacion);
create index if not exists guests_creado_idx  on public.guests (created_at desc);
create index if not exists guests_nombre_idx  on public.guests (lower(nombre));

-- ---------- updated_at automático ------------------------------------

-- Solo se considera "modificado" un cambio real de contenido. Que alguien
-- abra su invitación no debe ensuciar la fecha de última modificación.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
declare
  ignorar text[] := array['updated_at', 'aperturas', 'primera_apertura_at'];
begin
  if (to_jsonb(new) - ignorar) is distinct from (to_jsonb(old) - ignorar) then
    new.updated_at = now();
  else
    new.updated_at = old.updated_at;
  end if;
  return new;
end;
$$;

drop trigger if exists guests_touch_updated_at on public.guests;
create trigger guests_touch_updated_at
  before update on public.guests
  for each row execute function public.touch_updated_at();

-- ---------- Historial de respuestas ----------------------------------
-- Si alguien cambia de opinión, la respuesta anterior no se pierde.

create table if not exists public.rsvp_eventos (
  id                   bigserial primary key,
  guest_id             uuid not null references public.guests (id) on delete cascade,
  estado               estado_confirmacion not null,
  cantidad_asistentes  smallint not null,
  restriccion          restriccion_alimentaria not null,
  comentario           text,
  created_at           timestamptz not null default now()
);

create index if not exists rsvp_eventos_guest_idx
  on public.rsvp_eventos (guest_id, created_at desc);

-- ---------- Límite de peticiones -------------------------------------
-- En Vercel cada invocación es un proceso nuevo: el contador tiene que
-- vivir en la base de datos para que sirva de algo.

create table if not exists public.rate_limits (
  key           text primary key,
  hits          integer not null default 0,
  window_start  timestamptz not null default now()
);

create or replace function public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now  timestamptz := now();
  v_hits integer;
begin
  insert into public.rate_limits as rl (key, hits, window_start)
  values (p_key, 1, v_now)
  on conflict (key) do update
    set hits = case
          when rl.window_start < v_now - make_interval(secs => p_window_seconds) then 1
          else rl.hits + 1
        end,
        window_start = case
          when rl.window_start < v_now - make_interval(secs => p_window_seconds) then v_now
          else rl.window_start
        end
  returning rl.hits into v_hits;

  return v_hits <= p_limit;
end;
$$;

-- ---------- Registro de aperturas ------------------------------------
-- Se llama cada vez que se abre una invitación personal. Es una sola
-- sentencia atómica para no necesitar leer antes de escribir.

create or replace function public.registrar_apertura(p_codigo text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.guests
     set aperturas = aperturas + 1,
         primera_apertura_at = coalesce(primera_apertura_at, now())
   where codigo_invitacion = p_codigo;
$$;

-- ---------- Estadísticas para la consola -----------------------------
-- Una sola consulta para todo el resumen del panel.

create or replace view public.guest_stats
with (security_invoker = on) as
select
  count(*)::int                                                          as total,
  count(*) filter (where estado_confirmacion = 'confirmado')::int        as confirmados,
  count(*) filter (where estado_confirmacion = 'no_asiste')::int         as no_asisten,
  count(*) filter (where estado_confirmacion = 'pendiente')::int         as pendientes,
  coalesce(sum(cantidad_asistentes) filter
    (where estado_confirmacion = 'confirmado'), 0)::int                  as personas_confirmadas,
  coalesce(sum(cantidad_personas_permitidas), 0)::int                    as cupos_totales,
  count(*) filter (where estado_confirmacion = 'pendiente'
                     and primera_apertura_at is not null)::int           as abiertas_sin_responder
from public.guests;

-- ---------- Seguridad ------------------------------------------------
-- RLS activo y SIN políticas: ni `anon` ni `authenticated` pueden tocar
-- nada. La aplicación entra siempre desde el servidor con la clave
-- secreta, que es la única que salta RLS. El navegador jamás habla
-- directamente con Supabase.

alter table public.guests       enable row level security;
alter table public.rsvp_eventos enable row level security;
alter table public.rate_limits  enable row level security;

revoke all on public.guests       from anon, authenticated;
revoke all on public.rsvp_eventos from anon, authenticated;
revoke all on public.rate_limits  from anon, authenticated;
revoke all on public.guest_stats  from anon, authenticated;
revoke all on sequence public.rsvp_eventos_id_seq from anon, authenticated;
revoke execute on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
revoke execute on function public.registrar_apertura(text) from public, anon, authenticated;
