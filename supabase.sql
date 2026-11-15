-- Jalankan di Supabase > SQL Editor
alter table data_tablet enable row level security;
alter table koneksi_tablet enable row level security;

create policy "baca data_tablet" on data_tablet for select to anon using (true);
create policy "baca koneksi" on koneksi_tablet for select to anon using (true);
create policy "tambah koneksi" on koneksi_tablet for insert to anon with check (true);
create policy "ubah koneksi" on koneksi_tablet for update to anon using (true) with check (true);

-- Aktifkan realtime (untuk notifikasi + suara saat data berubah)
alter publication supabase_realtime add table koneksi_tablet;
