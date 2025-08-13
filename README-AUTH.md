# Sistem Autentikasi ROTASI

Sistem autentikasi untuk website kegiatan ROTASI (Regenerasi dan Orientasi Mahasiswa PSTI) dengan 4 jenis user: Peserta, Mentor, Divisi Acara, dan Komdis.

## 🏗️ Arsitektur Sistem

### Jenis User
1. **🧑‍🎓 Peserta** - Mahasiswa baru yang mengikuti ROTASI
2. **🧑‍🏫 Mentor** - Pembimbing per sektor (1-10)
3. **🟧 Divisi Acara** - Panitia dengan akses penuh
4. **🟥 Komdis** - Panitia dengan akses read-only

### Alur Autentikasi

#### Register
- **Peserta**: Nama, NIM, Email, Sektor, Password Sektor
- **Mentor**: Nama, Email, Password Login, Sektor, Password Sektor
- **Divisi Acara/Komdis**: Nama, Email, Password Login, Password Divisi

#### Login
- **Peserta**: Nama, Sektor, Password Sektor
- **Mentor**: Nama, Sektor, Password Sektor
- **Divisi Acara/Komdis**: Nama, Password Login

## 🗄️ Database Schema

### Tabel `users`
```sql
- id (UUID, Primary Key)
- nama_lengkap (VARCHAR)
- email (VARCHAR, Unique)
- nim (VARCHAR, Unique)
- role (ENUM: 'peserta', 'mentor', 'acara', 'komdis')
- sektor (INTEGER)
- password_hash (VARCHAR)
- login_password_hash (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabel `sector_passwords`
```sql
- id (SERIAL, Primary Key)
- sector_number (INTEGER, Unique)
- sector_name (VARCHAR)
- uuid_password (VARCHAR, Unique)
- created_at (TIMESTAMP)
```

### Tabel `division_passwords`
```sql
- id (SERIAL, Primary Key)
- division_name (VARCHAR, Unique)
- uuid_password (VARCHAR, Unique)
- created_at (TIMESTAMP)
```

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Setup Supabase
1. Buat project di [Supabase](https://supabase.com)
2. Jalankan script SQL dari `database-schema.sql`
3. Set environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Default Passwords

#### Sektor Passwords (1-10)
- Sektor 1: `abc-123`
- Sektor 2: `def-456`
- Sektor 3: `ghi-789`
- Sektor 4: `jkl-012`
- Sektor 5: `mno-345`
- Sektor 6: `pqr-678`
- Sektor 7: `stu-901`
- Sektor 8: `vwx-234`
- Sektor 9: `yza-567`
- Sektor 10: `bcd-890`

#### Division Passwords
- Divisi Acara: `acara-2024`
- Komdis: `komdis-2024`

## 📁 Struktur File

```
├── lib/
│   └── supabase.ts              # Supabase client & auth service
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── components/
│   └── auth/
│       ├── register-form.tsx    # Form registrasi
│       └── login-form.tsx       # Form login
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── register/
│   │       │   └── route.ts     # API register
│   │       └── login/
│   │           └── route.ts     # API login
│   ├── auth/
│   │   ├── register-divisi/
│   │   │   └── page.tsx         # Halaman register
│   │   └── login/
│   │       └── page.tsx         # Halaman login
│   └── dashboard/
│       └── page.tsx             # Dashboard user
└── database-schema.sql          # Schema database
```

## 🔧 Penggunaan

### Register User Baru
```typescript
// Peserta
const user = await authService.registerPeserta({
  nama_lengkap: "John Doe",
  nim: "123456789",
  email: "john@example.com",
  sektor: 1,
  sectorPassword: "abc-123"
})

// Mentor
const mentor = await authService.registerMentor({
  nama_lengkap: "Jane Smith",
  email: "jane@example.com",
  loginPassword: "password123",
  sektor: 1,
  sectorPassword: "abc-123"
})

// Divisi Acara
const acara = await authService.registerDivisi({
  nama_lengkap: "Bob Wilson",
  email: "bob@example.com",
  loginPassword: "password123",
  divisionPassword: "acara-2024",
  role: "acara"
})
```

### Login User
```typescript
// Peserta/Mentor
const user = await authService.loginPeserta({
  nama_lengkap: "John Doe",
  sektor: 1,
  sectorPassword: "abc-123"
})

// Divisi Acara/Komdis
const user = await authService.loginDivisi({
  nama_lengkap: "Bob Wilson",
  loginPassword: "password123",
  role: "acara"
})
```

### Menggunakan Auth Context
```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>Please login</div>
  
  return (
    <div>
      <h1>Welcome {user.nama_lengkap}</h1>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## 🔒 Keamanan

### Row Level Security (RLS)
- User hanya bisa melihat data sendiri
- Divisi Acara bisa melihat semua data
- Komdis hanya bisa membaca data (read-only)

### Password Validation
- Password sektor divalidasi saat register
- Password divisi divalidasi saat register
- Login menggunakan password yang sesuai dengan role

### Session Management
- User data disimpan di localStorage
- Auto-redirect ke login jika tidak authenticated
- Logout menghapus session

## 🎨 UI Components

### Register Form
- Tab-based interface untuk 4 jenis user
- Form validation
- Error handling
- Success feedback

### Login Form
- Tab-based interface untuk 4 jenis user
- Form validation
- Error handling

### Dashboard
- Role-specific content
- User info display
- Logout functionality

## 🚀 Deployment

1. Setup Supabase project
2. Jalankan database schema
3. Set environment variables
4. Deploy ke Vercel/Netlify

## 📝 Notes

- Password disimpan dalam bentuk plain text untuk kemudahan testing
- Untuk production, gunakan hashing (bcrypt/argon2)
- Implementasikan rate limiting untuk API endpoints
- Tambahkan email verification untuk keamanan tambahan
- Implementasikan password reset functionality 