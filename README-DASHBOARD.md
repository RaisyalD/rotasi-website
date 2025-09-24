# ROTASI Dashboard System

Sistem dashboard terintegrasi untuk platform ROTASI dengan fitur manajemen tugas dan evaluasi berdasarkan role.

## Fitur Utama

### 🎯 Dashboard Peserta
- **Upload Tugas**: Upload file ZIP/PDF/DOC dengan deskripsi
- **Lihat Tugas**: Daftar tugas sektor dengan status dan deadline
- **Evaluasi Tugas**: Lihat nilai dan komentar evaluasi
- **Riwayat Submission**: Track semua tugas yang sudah dikumpulkan

### 👨‍🏫 Dashboard Mentor
- **Read-Only Access**: Lihat mentee dan tugas mereka
- **Detail Tugas**: Lihat submission tugas mentee dengan file download
- **Progress Tracking**: Monitor progress mentee per tugas
- **Evaluasi Status**: Lihat status evaluasi tugas mentee

### 🏛️ Dashboard Komdis
- **Read-Only Access**: Lihat semua sektor dan anggotanya
- **Overview Sektor**: Statistik peserta dan mentor per sektor
- **Detail Anggota**: Lihat daftar lengkap peserta dan mentor
- **Submission Tugas**: Lihat semua submission tugas dari semua sektor

### 🎪 Dashboard Acara
- **Full Access**: Manajemen lengkap tugas dan evaluasi
- **Kelola Tugas**: Create, edit, delete tugas dengan konfirmasi modern
- **Evaluasi Tugas**: Berikan nilai dan komentar evaluasi
- **Dashboard Per Sektor**: Evaluasi submission per sektor
- **File Management**: Lihat dan download file tugas peserta

## Setup Database

### 1. Jalankan Schema Database
```sql
-- Jalankan file database-schema.sql di Supabase SQL Editor
```

### 2. Setup Storage Bucket
```sql
-- Jalankan file supabase-storage-setup.sql di Supabase SQL Editor
```

### 3. Environment Variables
Buat file `.env.local` dengan konfigurasi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Struktur Database

### Tables
- `users`: Data pengguna (peserta, mentor, acara, komdis)
- `sector_passwords`: Password untuk registrasi sektor
- `division_passwords`: Password untuk registrasi divisi
- `tasks`: Data tugas yang dibuat acara
- `task_submissions`: Submission tugas dari peserta

### Storage
- `rotasi-files`: Bucket untuk menyimpan file tugas
- Folder: `task-submissions/` untuk file tugas

## API Endpoints

### Tasks
- `GET /api/tasks` - Ambil daftar tugas
- `POST /api/tasks` - Buat tugas baru
- `PUT /api/tasks/[id]` - Update tugas
- `DELETE /api/tasks/[id]` - Hapus tugas

### Submissions
- `GET /api/submissions` - Ambil daftar submission
- `POST /api/submissions` - Buat submission baru
- `POST /api/submissions/[id]/evaluate` - Evaluasi submission

### Users
- `GET /api/users` - Ambil daftar users berdasarkan role/sektor

### Upload
- `POST /api/upload` - Upload file ke Supabase Storage

## Fitur Keamanan

### Row Level Security (RLS)
- Peserta hanya bisa lihat tugas sektor mereka
- Mentor hanya bisa lihat mentee dan tugas sektor mereka
- Komdis bisa lihat semua data (read-only)
- Acara bisa akses penuh untuk manajemen

### File Upload Security
- Validasi file type (ZIP, PDF, DOC, DOCX)
- File size limit (10MB)
- Unique filename dengan timestamp
- Public read access untuk file yang diupload

## Cara Penggunaan

### 1. Registrasi User
- Peserta: Daftar dengan NIM, email, sektor, dan password sektor
- Mentor: Daftar dengan email, sektor, dan password sektor
- Acara/Komdis: Daftar dengan email dan password divisi

### 2. Login
- Setiap role login dengan kredensial yang sesuai
- Redirect ke dashboard sesuai role

### 3. Manajemen Tugas (Acara)
- Buat tugas baru dengan judul, deskripsi, sektor, dan deadline
- Edit tugas yang sudah ada
- Hapus tugas dengan konfirmasi dialog

### 4. Upload Tugas (Peserta)
- Lihat daftar tugas sektor
- Upload file dan tambah deskripsi
- Track status submission dan evaluasi

### 5. Evaluasi Tugas (Acara)
- Lihat submission tugas per sektor
- Berikan nilai (0-100) dan komentar
- Download file tugas untuk review

## UI/UX Features

### Modern Design
- Responsive design dengan Tailwind CSS
- Dark/light mode support
- Loading states dan error handling
- Interactive dialogs dan modals

### User Experience
- Tab navigation untuk organisasi konten
- Card-based layout untuk informasi
- Badge indicators untuk status
- Icon-based navigation

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes

## Development

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Lucide React

### File Structure
```
components/
├── dashboard/
│   ├── PesertaDashboard.tsx
│   ├── MentorDashboard.tsx
│   ├── KomdisDashboard.tsx
│   └── AcaraDashboard.tsx
├── ui/
│   ├── dialog.tsx
│   ├── table.tsx
│   └── textarea.tsx
└── auth/
    └── register-form.tsx

app/
├── api/
│   ├── tasks/
│   ├── submissions/
│   ├── users/
│   └── upload/
└── dashboard/
    └── page.tsx
```

## Deployment

### Vercel
1. Connect repository ke Vercel
2. Set environment variables
3. Deploy otomatis dari main branch

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Maintenance

### Database Backup
- Supabase automatic backups
- Manual backup via pg_dump

### Storage Management
- Monitor storage usage
- Clean up old files
- Archive completed tasks

### Performance
- Optimize queries dengan indexing
- Implement caching untuk data statis
- Monitor API response times

## Support

Untuk bantuan teknis atau pertanyaan, silakan hubungi tim development ROTASI.
