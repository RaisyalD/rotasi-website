# Fitur Konfirmasi Logout

Dokumen ini menjelaskan implementasi fitur konfirmasi logout yang telah ditambahkan ke aplikasi ROTASI.

## Overview

Fitur konfirmasi logout memastikan bahwa pengguna tidak secara tidak sengaja logout dari akun mereka. Ketika tombol logout ditekan, akan muncul popup konfirmasi yang meminta persetujuan pengguna sebelum melakukan logout.

## Fitur yang Ditambahkan

### 1. Komponen LogoutConfirmDialog
**File**: `components/LogoutConfirmDialog.tsx`

Komponen dialog yang menampilkan:
- Judul konfirmasi logout
- Pesan konfirmasi dengan nama pengguna
- Peringatan tentang konsekuensi logout
- Tombol "Tidak" untuk membatalkan
- Tombol "Ya, Logout" untuk konfirmasi

**Props:**
- `isOpen`: boolean - mengontrol visibility dialog
- `onClose`: function - dipanggil saat dialog ditutup
- `onConfirm`: function - dipanggil saat logout dikonfirmasi
- `userName`: string (optional) - nama pengguna untuk personalisasi pesan

### 2. Integrasi di Navbar
**File**: `components/navbar.tsx`

Logout confirmation telah diintegrasikan di:
- **Desktop dropdown menu**: Ketika user mengklik tombol logout di dropdown
- **Mobile menu**: Ketika user mengklik tombol logout di menu mobile

### 3. Integrasi di Dashboard Page
**File**: `app/dashboard/page.tsx`

Logout confirmation telah diintegrasikan di:
- **Header dashboard**: Ketika user mengklik tombol logout di header dashboard

## Alur Kerja

1. **User mengklik tombol logout** di navbar atau dashboard
2. **Dialog konfirmasi muncul** dengan pesan yang dipersonalisasi
3. **User memilih:**
   - **"Tidak"**: Dialog ditutup, user tetap login
   - **"Ya, Logout"**: Proses logout dilanjutkan

## Kode yang Dimodifikasi

### Navbar Component
```typescript
// State untuk mengontrol dialog
const [showLogoutDialog, setShowLogoutDialog] = useState(false)

// Handler untuk menampilkan dialog
const handleLogoutClick = () => {
  setShowLogoutDialog(true)
}

// Handler untuk logout aktual (tidak berubah)
const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch {}
  logout()
  setIsOpen(false)
  router.push('/')
}
```

### Dashboard Page Component
```typescript
// State untuk mengontrol dialog
const [showLogoutDialog, setShowLogoutDialog] = useState(false)

// Handler untuk menampilkan dialog
const handleLogoutClick = () => {
  setShowLogoutDialog(true)
}

// Handler untuk logout aktual (tidak berubah)
const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch (e) {
    // ignore
  }
  logout()
  router.push('/')
}
```

## UI/UX Features

### Dialog Design
- **Icon**: LogOut icon dengan background merah
- **Warning**: Alert triangle dengan background kuning
- **Buttons**: 
  - "Tidak" - button outline
  - "Ya, Logout" - button destructive dengan icon

### Responsive Design
- Dialog responsive untuk semua ukuran layar
- Mobile-friendly touch targets
- Consistent dengan design system aplikasi

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Focus management

## Testing

### Manual Testing Checklist
- [ ] Klik logout di navbar desktop dropdown
- [ ] Klik logout di navbar mobile menu
- [ ] Klik logout di dashboard header
- [ ] Test tombol "Tidak" - dialog harus tertutup
- [ ] Test tombol "Ya, Logout" - logout harus berhasil
- [ ] Test dengan berbagai role user (peserta, mentor, acara)

### Expected Behavior
1. **Tombol "Tidak"**: Dialog tertutup, user tetap login
2. **Tombol "Ya, Logout"**: User logout dan diarahkan ke halaman beranda
3. **Personalized message**: Nama user muncul di pesan konfirmasi

## Browser Compatibility

Fitur ini kompatibel dengan:
- Chrome/Chromium
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## WebView Compatibility

Fitur logout confirmation telah dioptimalkan untuk WebView Java dengan:
- Proper event handling
- Touch-friendly interface
- Consistent behavior across platforms

## Future Enhancements

Potensi pengembangan lebih lanjut:
1. **Remember choice**: Opsi untuk tidak menampilkan konfirmasi lagi
2. **Auto-logout warning**: Peringatan sebelum session timeout
3. **Multiple device logout**: Logout dari semua device sekaligus
4. **Logout reason**: Dropdown untuk memilih alasan logout
