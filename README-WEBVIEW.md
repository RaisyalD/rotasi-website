# WebView Compatibility Guide

Dokumen ini menjelaskan kompatibilitas aplikasi ROTASI dengan WebView Java dan solusi untuk masalah yang mungkin terjadi.

## Masalah yang Diperbaiki

### 1. localStorage Issues
- **Masalah**: WebView Java mungkin tidak mendukung atau membatasi akses localStorage
- **Solusi**: Implementasi `SafeStorage` class yang menangani error localStorage dengan graceful fallback

### 2. Hydration Mismatch
- **Masalah**: Perbedaan antara server-side dan client-side rendering
- **Solusi**: Penambahan `suppressHydrationWarning` dan proper mounting check

### 3. Error Handling
- **Masalah**: Error tidak tertangani dengan baik di WebView
- **Solusi**: Implementasi ErrorBoundary dan error handling yang lebih robust

### 4. CORS dan Headers
- **Masalah**: WebView mungkin memerlukan konfigurasi CORS yang berbeda
- **Solusi**: Penambahan security headers di `next.config.mjs`

## Fitur WebView Compatibility

### SafeStorage Class
```typescript
import { SafeStorage } from '@/lib/webview-utils'

// Safe localStorage operations
SafeStorage.setItem('key', 'value')
SafeStorage.getItem('key')
SafeStorage.removeItem('key')
```

### WebView Detection
```typescript
import { isWebView, checkWebViewCompatibility } from '@/lib/webview-utils'

// Check if running in webview
const isInWebView = isWebView()

// Check compatibility
const compatibility = checkWebViewCompatibility()
```

### Safe Fetch
```typescript
import { safeFetch } from '@/lib/webview-utils'

// Safe fetch with error handling
const response = await safeFetch('/api/endpoint')
```

## CSS untuk WebView

Aplikasi secara otomatis menambahkan class `webview-environment` ke body ketika terdeteksi WebView, dengan styling khusus:

- Touch scrolling yang lebih baik
- Font size 16px untuk input (mencegah zoom)
- Touch target minimum 44px
- User selection yang dioptimalkan

## Error Boundary

ErrorBoundary menangani error JavaScript dengan graceful fallback:

- Menampilkan pesan error yang user-friendly
- Tombol "Coba Lagi" untuk retry
- Tombol "Refresh Halaman" untuk reload
- Error details di development mode

## Konfigurasi WebView Java

Untuk aplikasi WebView Java, pastikan konfigurasi berikut:

### 1. Enable JavaScript
```java
webView.getSettings().setJavaScriptEnabled(true);
```

### 2. Enable DOM Storage
```java
webView.getSettings().setDomStorageEnabled(true);
```

### 3. Set User Agent
```java
webView.getSettings().setUserAgentString(
    webView.getSettings().getUserAgentString() + " WebView"
);
```

### 4. Handle Console Messages
```java
webView.setWebChromeClient(new WebChromeClient() {
    @Override
    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
        Log.d("WebView", consoleMessage.message());
        return true;
    }
});
```

### 5. Handle Page Errors
```java
webView.setWebViewClient(new WebViewClient() {
    @Override
    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
        Log.e("WebView", "Error: " + error.getDescription());
    }
});
```

## Testing WebView Compatibility

### 1. Test localStorage
Buka console browser dan jalankan:
```javascript
// Test localStorage availability
console.log('localStorage available:', typeof localStorage !== 'undefined')

// Test SafeStorage
import { SafeStorage } from './lib/webview-utils'
console.log('SafeStorage test:', SafeStorage.setItem('test', 'value'))
```

### 2. Test Error Handling
- Matikan koneksi internet
- Coba akses halaman yang memerlukan data
- Pastikan error ditampilkan dengan baik

### 3. Test Touch Interaction
- Pastikan semua button dapat diklik
- Test scrolling pada daftar panjang
- Test input fields tidak menyebabkan zoom

## Troubleshooting

### Error: "localStorage is not defined"
- Pastikan menggunakan `SafeStorage` instead of direct localStorage
- Check WebView settings untuk DOM Storage

### Error: "fetch is not defined"
- Pastikan menggunakan `safeFetch` instead of direct fetch
- Check WebView settings untuk JavaScript

### Hydration Mismatch
- Pastikan `suppressHydrationWarning` ada di layout
- Check untuk perbedaan server/client rendering

### CORS Errors
- Check `next.config.mjs` untuk security headers
- Pastikan WebView mengizinkan cross-origin requests

## Monitoring

Aplikasi akan log informasi kompatibilitas di console:
```
WebView Compatibility Check: {
  localStorage: true,
  fetch: true,
  isWebView: true
}
```

Monitor log ini untuk memastikan semua fitur berfungsi dengan baik di WebView.
