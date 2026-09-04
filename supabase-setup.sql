-- Run this once in your Supabase project's SQL Editor.

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  stock_number text unique not null,
  brand text not null,
  model text not null,
  year int,
  vehicle_type text,
  chassis_number text unique,
  engine_number text,
  engine text,
  transmission text,
  fuel text,
  mileage int,
  color text,
  body_type text,
  payload text,
  dimensions text,
  cabin_type text,
  condition text,
  purchase_price numeric default 0,
  shipping_cost numeric default 0,
  customs_cost numeric default 0,
  other_expenses numeric default 0,
  selling_price numeric,
  notes text,
  status text not null default 'AVAILABLE',
  buyer text,
  sale_price numeric,
  sale_date date,
  payment_status text,
  amount_paid numeric,
  photos jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table vehicles enable row level security;

create policy "public can read vehicles" on vehicles
  for select using (true);

create policy "authenticated can insert vehicles" on vehicles
  for insert to authenticated with check (true);

create policy "authenticated can update vehicles" on vehicles
  for update to authenticated using (true);

create policy "authenticated can delete vehicles" on vehicles
  for delete to authenticated using (true);

-- After running this, go to Storage in the Supabase dashboard and create
-- a bucket named exactly:  vehicle-photos   (mark it as a PUBLIC bucket).
-- Then come back here and run the policies below.

create policy "public read vehicle photos" on storage.objects
  for select using (bucket_id = 'vehicle-photos');

create policy "authenticated upload vehicle photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'vehicle-photos');

create policy "authenticated delete vehicle photos" on storage.objects
  for delete to authenticated using (bucket_id = 'vehicle-photos');
