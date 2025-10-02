# Sistem Admin ROTASI

## Overview
Sistem admin ROTASI telah dibuat untuk menggantikan divisi komdis yang sebelumnya ada. Admin memiliki akses penuh untuk melihat dan mengelola semua data dalam sistem.

## Perubahan yang Dilakukan

### 1. Database Schema
- **Role Update**: Mengubah role `komdis` menjadi `admin` di tabel `users`
- **Division Passwords**: Mengupdate `division_passwords` table untuk menggunakan `Admin` instead of `Komdis`
- **Task Type**: Menambahkan kolom `task_type` ke tabel `tasks` untuk mendukung jenis tugas (individu/per_sektor/angkatan)
- **RLS Policies**: Mengupdate Row Level Security policies untuk mendukung role `admin`

### 2. Authentication System
- **Login Page**: Membuat halaman login admin terpisah di `/auth/login-admin`
- **Register Page**: Membuat halaman register admin di `/auth/register-admin`
- **Login Form**: Komponen `AdminLoginForm` untuk autentikasi admin
- **Register Form**: Komponen `AdminRegisterForm` untuk registrasi admin
- **API Routes**: Mengupdate API login dan register untuk mendukung role `admin`
- **AuthContext**: Mengupdate context untuk mendukung role `admin`

### 3. Dashboard System
- **Admin Dashboard**: Dashboard admin terpisah di `/admin/dashboard`
- **AdminDashboard Component**: Komponen dashboard khusus admin dengan fitur lengkap
- **Route Protection**: Middleware mengupdate untuk melindungi route `/admin/*`
- **Redirect Logic**: Dashboard utama mengarahkan admin ke dashboard terpisah

### 4. Fitur Admin Dashboard

#### Tab Data Peserta
- Menampilkan semua peserta yang terdaftar
- Dikelompokkan per sektor dengan nama sektor
- Menampilkan informasi lengkap: nama, NIM, email, sektor

#### Tab Panitia
- **Divisi Acara**: Daftar panitia divisi acara
- **Mentor**: Daftar mentor per sektor dengan informasi sektor yang diampu

#### Tab Penugasan
- Menampilkan semua penugasan yang dibuat oleh divisi acara
- Menampilkan jenis tugas (individu/per_sektor/angkatan)
- Menampilkan deadline dan deskripsi tugas
- Dikelompokkan per judul tugas untuk menghindari duplikasi

#### Tab Submission
- Menampilkan semua submission dari peserta
- Dikelompokkan per sektor
- Menampilkan status keterlambatan (terlambat/tepat waktu)
- Menampilkan nilai dan komentar evaluasi (jika ada)
- Menampilkan file submission yang dapat didownload

### 5. Migration
- **Migration File**: `migration-komdis-to-admin.sql` untuk mengupdate data existing
- **User Role Update**: Mengubah user dengan role `komdis` menjadi `admin`
- **Division Password Update**: Mengupdate password divisi dari `Komdis` ke `Admin`
- **Task Type Addition**: Menambahkan kolom `task_type` ke tabel tasks

## Cara Menggunakan

### 1. Setup Database
```sql
-- Opsi 1: Jalankan migration script aman (recommended)
\i migration-safe-admin-setup.sql

-- Opsi 2: Jalankan migration script lengkap
\i migration-complete-admin-setup.sql

-- Opsi 3: Jika ada masalah dengan login user lain, jalankan perbaikan
\i migration-fix-user-policies.sql

-- Opsi 4: Jika masih ada masalah login, cek data user
\i migration-check-user-data.sql

-- Opsi 5: Jika masih bermasalah, disable RLS sementara untuk testing
\i migration-disable-rls-temporarily.sql

-- Opsi 6: Jika RLS bermasalah, disable RLS secara permanen (recommended)
\i migration-disable-rls-permanently.sql

-- Opsi 7: Enable RLS dengan policies sederhana
\i migration-enable-rls-simple.sql

-- Opsi 8: Jalankan migration script satu per satu
\i migration-komdis-to-admin.sql
\i migration-fix-role-constraint.sql
\i migration-fix-rls-policies.sql
```

### 2. Register Admin
- Akses `/auth/register-admin`
- Isi data: nama lengkap, email, password login, dan password divisi admin
- Password divisi admin: `admin-2024`

### 3. Login Admin
- Akses `/auth/login-admin`
- Gunakan email dan password login yang sudah terdaftar dengan role admin

### 4. Dashboard Admin
- Setelah login, admin akan diarahkan ke `/admin/dashboard`
- Dashboard terpisah dari dashboard divisi lain
- Memiliki 4 tab utama: Data Peserta, Panitia, Penugasan, Submission

## File yang Dibuat/Dimodifikasi

### File Baru
- `app/auth/login-admin/page.tsx`
- `app/auth/register-admin/page.tsx`
- `components/auth/admin-login-form.tsx`
- `components/auth/admin-register-form.tsx`
- `app/admin/dashboard/page.tsx`
- `components/dashboard/AdminDashboard.tsx`
- `migration-komdis-to-admin.sql`
- `migration-fix-role-constraint.sql`
- `migration-fix-rls-policies.sql`
- `migration-fix-user-policies.sql`
- `migration-complete-admin-setup.sql`
- `migration-safe-admin-setup.sql`
- `migration-check-user-data.sql`
- `migration-disable-rls-temporarily.sql`
- `migration-disable-rls-permanently.sql`
- `migration-enable-rls-simple.sql`
- `SECURITY-WITHOUT-RLS.md`
- `README-ADMIN-SYSTEM.md`

### File yang Dimodifikasi
- `database-schema.sql`
- `contexts/AuthContext.tsx`
- `lib/supabase.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`
- `app/dashboard/page.tsx`
- `middleware.ts`

## Keamanan
- Admin memiliki akses penuh ke semua data
- Service role key digunakan untuk operasi admin (bypass RLS untuk mencegah infinite recursion)
- Middleware melindungi route admin
- Autentikasi terpisah untuk admin
- Password divisi admin: `admin-2024`

## Catatan Penting
- Pastikan menjalankan migration script sebelum menggunakan sistem admin
- Admin dashboard terpisah dari dashboard divisi lain
- Semua fitur admin hanya dapat diakses oleh user dengan role `admin`
- Password divisi admin: `admin-2024`
- **Recommended**: Gunakan `migration-safe-admin-setup.sql` untuk setup yang aman
- Jika terjadi error "users_role_check", jalankan `migration-fix-role-constraint.sql`
- Jika terjadi error "infinite recursion detected in policy", jalankan `migration-fix-rls-policies.sql`
- Jika terjadi error "policy already exists", gunakan `migration-safe-admin-setup.sql`
- Jika user mentor/acara/peserta tidak bisa login, jalankan `migration-fix-user-policies.sql`
- Jika masih ada masalah login, jalankan `migration-check-user-data.sql` untuk debugging
- Jika RLS bermasalah, gunakan `migration-disable-rls-temporarily.sql` untuk testing
- Service role key digunakan untuk operasi admin untuk menghindari masalah RLS

## Troubleshooting Login Issues
1. **Cek data user**: Jalankan `migration-check-user-data.sql`
2. **Disable RLS sementara**: Jalankan `migration-disable-rls-temporarily.sql`
3. **Test login**: Coba login dengan user yang ada
4. **Disable RLS permanen**: Jalankan `migration-disable-rls-permanently.sql` (recommended)
5. **Enable RLS sederhana**: Jalankan `migration-enable-rls-simple.sql`
6. **Test login lagi**: Pastikan login masih berfungsi
7. **Restore policies lengkap**: Jalankan `migration-safe-admin-setup.sql`

## ⚠️ RLS Disabled - Security Notes
- **RLS Dinonaktifkan**: Database tidak lagi melindungi data
- **Application Security**: Semua keamanan di level aplikasi
- **Lihat**: `SECURITY-WITHOUT-RLS.md` untuk detail keamanan
- **Monitoring**: Pantau akses ke sistem secara berkala
