-- Enable UUID generation
create extension if not exists "pgcrypto";

-- 1. TABLES
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'student' check (role in ('student','teacher')),
  full_name text not null,
  username text unique not null,
  avatar_color text default '#65A30D',
  is_guest boolean default false,
  xp int default 0,
  created_at timestamptz default now()
);

create table classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  join_code text unique not null,
  archived boolean default false,
  created_at timestamptz default now()
);

create table class_members (
  class_id uuid references classes(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (class_id, student_id)
);

create table challenges (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete set null,
  title text not null,
  description_md text not null,
  level int not null check (level between 1 and 3),
  topics text[] default '{}',
  starter_html text default '',
  starter_css text default '',
  target_image_url text,
  tests jsonb not null default '[]',
  fallback_hints jsonb default '{}'::jsonb,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Solution is strictly isolated from students
create table challenge_secrets (
  challenge_id uuid primary key references challenges(id) on delete cascade,
  solution_html text not null,
  solution_css text not null default ''
);

create table assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  challenge_id uuid references challenges(id) on delete cascade,
  due_at timestamptz,
  created_at timestamptz default now(),
  unique (class_id, challenge_id)
);

create table live_rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  teacher_id uuid not null references profiles(id) on delete cascade,
  class_id uuid references classes(id) on delete set null,
  challenge_id uuid not null references challenges(id) on delete cascade,
  status text not null default 'lobby' check (status in ('lobby','live','paused','ended')),
  duration_sec int default 900,
  started_at timestamptz,
  created_at timestamptz default now()
);

create table room_participants (
  room_id uuid references live_rooms(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  nickname text not null,
  joined_at timestamptz default now(),
  primary key (room_id, user_id)
);

create table attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  challenge_id uuid not null references challenges(id) on delete cascade,
  room_id uuid references live_rooms(id) on delete set null,
  assignment_id uuid references assignments(id) on delete set null,
  status text not null default 'in_progress' check (status in ('in_progress','passed')),
  code_html text default '',
  code_css text default '',
  runs int default 0,
  failed_checks_since_l3 int default 0,
  max_hint_level int default 0,
  score int default 0,
  started_at timestamptz default now(),
  passed_at timestamptz,
  updated_at timestamptz default now(),
  unique nulls not distinct (user_id, challenge_id, room_id)
);

create table hint_events (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references attempts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  challenge_id uuid references challenges(id) on delete cascade,
  room_id uuid references live_rooms(id) on delete set null,
  level int not null check (level between 1 and 4),
  concept text,
  line int,
  hint_text text not null,
  from_fallback boolean default false,
  created_at timestamptz default now()
);

create table ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade,
  fn text not null,
  created_at timestamptz default now()
);

create table teacher_invites (
  code text primary key,
  used_by uuid references profiles(id),
  used_at timestamptz
);

create index on attempts (user_id, challenge_id);
create index on attempts (room_id);
create index on hint_events (room_id, created_at);
create index on ai_usage (user_id, created_at);

-- 2. TRIGGERS & RPC FUNCTIONS
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_challenges_updated before update on challenges
for each row execute function set_updated_at();

create trigger trg_attempts_updated before update on attempts
for each row execute function set_updated_at();

-- Never trust role from metadata; always insert as 'student'
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, full_name, username, is_guest)
  values (
    new.id,
    'student',
    coalesce(new.raw_user_meta_data->>'full_name', 'Mehmon'),
    coalesce(new.raw_user_meta_data->>'username', 'guest_' || substr(new.id::text, 1, 8)),
    coalesce((new.raw_user_meta_data->>'is_guest')::boolean, false)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Join Class by Code
create or replace function public.join_class(p_code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_class_id uuid;
begin
  select id into v_class_id from classes
  where upper(join_code) = upper(trim(p_code)) and archived = false;

  if v_class_id is null then
    raise exception 'Bu kod bilan sinf topilmadi';
  end if;

  insert into class_members (class_id, student_id)
  values (v_class_id, auth.uid())
  on conflict do nothing;

  return v_class_id;
end;
$$;

-- Generate unambiguous 6-char room code
create or replace function public.generate_clean_code(p_len int default 6)
returns text language plpgsql as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  res text := '';
  i int;
begin
  for i in 1..p_len loop
    res := res || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return res;
end;
$$;

-- Create Live Room
create or replace function public.create_room(
  p_challenge_id uuid,
  p_class_id uuid default null,
  p_duration int default 900
)
returns live_rooms language plpgsql security definer set search_path = public as $$
declare
  v_code text;
  v_room live_rooms;
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'teacher') then
    raise exception 'Faqat ustozlar jonli xona ocha oladi';
  end if;

  v_code := public.generate_clean_code(6);
  insert into live_rooms (code, teacher_id, class_id, challenge_id, duration_sec)
  values (v_code, auth.uid(), p_class_id, p_challenge_id, p_duration)
  returning * into v_room;

  return v_room;
end;
$$;

-- Join Live Room
create or replace function public.join_room(p_code text, p_nickname text)
returns live_rooms language plpgsql security definer set search_path = public as $$
declare
  v_room live_rooms;
begin
  select * into v_room from live_rooms where upper(code) = upper(trim(p_code));
  if v_room.id is null then
    raise exception 'Xona topilmadi';
  end if;
  if v_room.status = 'ended' then
    raise exception 'Xona yopilgan';
  end if;

  insert into room_participants (room_id, user_id, nickname)
  values (v_room.id, auth.uid(), trim(p_nickname))
  on conflict (room_id, user_id) do update set nickname = excluded.nickname;

  return v_room;
end;
$$;

-- 3. ROW LEVEL SECURITY (RLS)
alter table profiles enable row level security;
alter table classes enable row level security;
alter table class_members enable row level security;
alter table challenges enable row level security;
alter table challenge_secrets enable row level security;
alter table assignments enable row level security;
alter table live_rooms enable row level security;
alter table room_participants enable row level security;
alter table attempts enable row level security;
alter table hint_events enable row level security;
alter table ai_usage enable row level security;
alter table teacher_invites enable row level security;

-- Helper function to check teacher role
create or replace function public.is_teacher()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher');
$$;

-- Profiles policies
create policy "Read own profile or teacher reads students" on profiles
for select using (
  id = auth.uid()
  or public.is_teacher()
);

create policy "Update own profile" on profiles
for update using (id = auth.uid())
with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));

-- Classes policies
create policy "Teacher full access on own classes" on classes
for all using (teacher_id = auth.uid());

create policy "Student reads joined classes" on classes
for select using (
  exists (select 1 from class_members cm where cm.class_id = classes.id and cm.student_id = auth.uid())
);

-- Class members policies
create policy "Student reads own memberships" on class_members
for select using (student_id = auth.uid());

create policy "Student can leave class" on class_members
for delete using (student_id = auth.uid());

create policy "Teacher manages own class members" on class_members
for all using (
  exists (select 1 from classes c where c.id = class_members.class_id and c.teacher_id = auth.uid())
);

-- Challenges policies
create policy "Read public or assigned challenges" on challenges
for select using (
  is_public = true
  or author_id = auth.uid()
  or public.is_teacher()
  or exists (
    select 1 from assignments a
    join class_members cm on cm.class_id = a.class_id
    where a.challenge_id = challenges.id and cm.student_id = auth.uid()
  )
  or exists (
    select 1 from live_rooms lr
    join room_participants rp on rp.room_id = lr.id
    where lr.challenge_id = challenges.id and rp.user_id = auth.uid()
  )
);

create policy "Teacher manages own challenges" on challenges
for all using (author_id = auth.uid() and public.is_teacher());

-- Challenge Secrets policies (NEVER readable by students)
create policy "Only author teacher accesses solution secrets" on challenge_secrets
for all using (
  public.is_teacher() and exists (
    select 1 from challenges c where c.id = challenge_secrets.challenge_id and c.author_id = auth.uid()
  )
);

-- Assignments policies
create policy "Teacher manages assignments" on assignments
for all using (
  exists (select 1 from classes c where c.id = assignments.class_id and c.teacher_id = auth.uid())
);

create policy "Student reads class assignments" on assignments
for select using (
  exists (select 1 from class_members cm where cm.class_id = assignments.class_id and cm.student_id = auth.uid())
);

-- Live rooms policies
create policy "Teacher manages own live rooms" on live_rooms
for all using (teacher_id = auth.uid());

create policy "Participants read joined live rooms" on live_rooms
for select using (
  exists (select 1 from room_participants rp where rp.room_id = live_rooms.id and rp.user_id = auth.uid())
);

-- Room participants policies
create policy "Participants read own row or teacher reads room" on room_participants
for select using (
  user_id = auth.uid()
  or exists (select 1 from live_rooms lr where lr.id = room_participants.room_id and lr.teacher_id = auth.uid())
);

-- Attempts policies
create policy "Student manages own attempts" on attempts
for all using (user_id = auth.uid());

create policy "Teacher reads class and room attempts" on attempts
for select using (public.is_teacher());

-- Hint events policies
create policy "Student reads own hints" on hint_events
for select using (user_id = auth.uid());

create policy "Teacher reads all hints" on hint_events
for select using (public.is_teacher());

-- Seed Teacher Invite Codes & Starter Challenges
insert into teacher_invites (code) values ('USTOZ2026'), ('ILMLA2026'), ('DEMO2026')
on conflict do nothing;

-- Seed 3 Core Starter Challenges (out of the 10 course topics)
do $$
declare
  c1 uuid := '11111111-1111-1111-1111-111111111111';
  c2 uuid := '22222222-2222-2222-2222-222222222222';
  c3 uuid := '33333333-3333-3333-3333-333333333333';
begin
  insert into challenges (id, title, description_md, level, topics, starter_html, starter_css, tests, fallback_hints, is_public)
  values
  (
    c1,
    '1. Sarlavha va paragraf',
    'Sahifaga asosiy `h1` sarlavha ichida **"Salom Dunyo"** matnini va uning ostiga `p` tegi ichida o''zingiz haqingizda qisqa gap yozing.',
    1,
    ARRAY['semantic-html', 'typography'],
    '<!-- Kodingizni shu yerga yozing -->\n<div>\n  \n</div>',
    'body {\n  font-family: sans-serif;\n  padding: 20px;\n}',
    '[
      {"type": "exists", "selector": "h1", "label": "Sarlavha (h1) tegi mavjud"},
      {"type": "text", "selector": "h1", "contains": "Salom", "label": "h1 ichida ''Salom'' so''zi bor"},
      {"type": "exists", "selector": "p", "label": "Paragraf (p) tegi mavjud"}
    ]'::jsonb,
    '{
      "1": "Sahifada eng katta sarlavha hosil qilish uchun qaysi HTML tegidan foydalanamiz?",
      "2": "2-qatordagi div ichiga h1 va p teglarini joylashtiring.",
      "3": "Masalan: <h1>Mening sahifam</h1> va <p>Matn</p> ko''rinishida yoziladi.",
      "4": "<h1>Salom Dunyo</h1>\n<p>Men dasturlashni o''rganyapman.</p>"
    }'::jsonb,
    true
  ),
  (
    c2,
    '5. Flex bilan markazlash',
    '`.container` blokining ichidagi `.card` elementini `flexbox` yordamida ham gorizontal, ham vertikal markazga keltiring.',
    2,
    ARRAY['flexbox', 'box-model'],
    '<div class="container">\n  <div class="card">Markazdagi karta</div>\n</div>',
    '.container {\n  height: 240px;\n  border: 2px dashed #cbd5e1;\n  /* Shu yerga flex xossalarini yozing */\n}\n.card {\n  padding: 16px 24px;\n  background: #84cc16;\n  border-radius: 12px;\n  font-weight: 600;\n}',
    '[
      {"type": "style", "selector": ".container", "property": "display", "op": "==", "value": "flex", "label": ".container display: flex bo''lishi kerak"},
      {"type": "style", "selector": ".container", "property": "justify-content", "op": "==", "value": "center", "label": "Gorizontal markazlash (justify-content: center)"},
      {"type": "style", "selector": ".container", "property": "align-items", "op": "==", "value": "center", "label": "Vertikal markazlash (align-items: center)"}
    ]'::jsonb,
    '{
      "1": "Flexbox-da elementlarni ikkala o''q bo''yicha markazlash uchun qaysi uchta CSS xossasi birga ishlatiladi?",
      "2": "CSS 4-qatordagi .container ichida display, justify-content va align-items xossalarini tekshiring.",
      "3": "Flex konteynerda justify-content asosiy o''qni, align-items esa kesishuvchi o''qni boshqaradi.",
      "4": "display: flex;\njustify-content: center;\nalign-items: center;"
    }'::jsonb,
    true
  ),
  (
    c3,
    '7. Rasmlar galereyasi (Grid)',
    '`.gallery` konteynerini CSS Grid-ga o''tkazing va `gap` ni `16px` qilib belgilang. Ichida kamida 3 ta `.item` bloki bo''lsin.',
    3,
    ARRAY['grid', 'box-model'],
    '<div class="gallery">\n  <div class="item">1</div>\n  <div class="item">2</div>\n</div>',
    '.gallery {\n  /* Grid xossalarini qo''shing */\n}\n.item {\n  background: #e2e8f0;\n  padding: 24px;\n  border-radius: 8px;\n  text-align: center;\n}',
    '[
      {"type": "count", "selector": ".item", "op": ">=", "value": 3, "label": "Kamida 3 ta .item bloki bor"},
      {"type": "style", "selector": ".gallery", "property": "display", "op": "==", "value": "grid", "label": ".gallery display: grid bo''lishi kerak"},
      {"type": "style", "selector": ".gallery", "property": "gap", "op": "==", "value": "16px", "label": "Oraliq masofa (gap) 16px"}
    ]'::jsonb,
    '{
      "1": "HTML-da nechta .item borligini va CSS-da jadval (grid) tartibini qanday yoqishni tekshirdingizmi?",
      "2": "HTML-ga 3-chi .item qo''shing va CSS 2-qatorda .gallery uchun display hamda gap yozing.",
      "3": "CSS Grid yoqish uchun display: grid; va kataklar orasini ochish uchun gap: 16px; ishlatiladi.",
      "4": "display: grid;\ngap: 16px;"
    }'::jsonb,
    true
  )
  on conflict (id) do nothing;

  insert into challenge_secrets (challenge_id, solution_html, solution_css)
  values
  (c1, '<div><h1>Salom Dunyo</h1><p>Men O''zing Yoz platformasida o''qiyapman.</p></div>', 'body { font-family: sans-serif; padding: 20px; }'),
  (c2, '<div class="container"><div class="card">Markazdagi karta</div></div>', '.container { height: 240px; border: 2px dashed #cbd5e1; display: flex; justify-content: center; align-items: center; } .card { padding: 16px 24px; background: #84cc16; border-radius: 12px; font-weight: 600; }'),
  (c3, '<div class="gallery"><div class="item">1</div><div class="item">2</div><div class="item">3</div></div>', '.gallery { display: grid; gap: 16px; } .item { background: #e2e8f0; padding: 24px; border-radius: 8px; text-align: center; }')
  on conflict (challenge_id) do nothing;
end $$;
