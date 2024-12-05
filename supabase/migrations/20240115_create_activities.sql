-- Create activities table
create table if not exists public.activities (
    id bigint primary key generated always as identity,
    type text not null check (type in ('match', 'event', 'job')),
    title text not null,
    status text not null,
    score text,
    teams text,
    time text,
    location text,
    participants text,
    company text,
    deadline text,
    applications text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS (Row Level Security) policies
alter table public.activities enable row level security;

-- Create policy to allow anyone to read activities
create policy "Anyone can view activities"
    on public.activities
    for select
    using (true);

-- Create policy to allow authenticated users to create activities
create policy "Authenticated users can create activities"
    on public.activities
    for insert
    with check (auth.role() = 'authenticated');

-- Create policy to allow users to update their own activities
create policy "Users can update their own activities"
    on public.activities
    for update
    using (auth.uid() = created_by)
    with check (auth.uid() = created_by);

-- Add trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger activities_updated_at
    before update on public.activities
    for each row
    execute procedure public.handle_updated_at();

-- Insert sample data
insert into public.activities (type, title, status, score, teams, time, location, participants, company, deadline, applications)
values
    ('match', 'PWD vs Yong Sports', 'Live', '2 - 1', 'PWD vs Yong Sports', '75min', 'Bamenda Municipal Stadium', null, null, null, null),
    ('event', 'Tech Meetup', 'Ongoing', null, null, null, 'IT Center Bamenda', '45 registered', null, null, null),
    ('job', 'Event Coordinator Needed', 'Active', null, null, null, null, null, 'BLE Productions', '2 hours left', '12 applied'),
    ('match', 'YOSA vs Foncha Street FC', 'Upcoming', null, 'YOSA vs Foncha Street FC', '15:00', 'Bamenda Municipal Stadium', null, null, null, null),
    ('event', 'Cultural Dance Festival', 'Active', null, null, null, 'Community Center', '120 registered', null, null, null);

-- Create types enum
create type public.activity_type as enum ('match', 'event', 'job');
create type public.activity_status as enum ('Live', 'Ongoing', 'Active', 'Upcoming', 'Completed');

-- Add indexes for better query performance
create index activities_type_idx on public.activities (type);
create index activities_status_idx on public.activities (status);
create index activities_created_at_idx on public.activities (created_at desc);
