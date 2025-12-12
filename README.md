
# 🛡️ Siskamling Online

**Sistem Keamanan Lingkungan Digital Terintegrasi**

Siskamling Online adalah platform berbasis web yang dirancang untuk memodernisasi sistem keamanan lingkungan (RT/RW). Aplikasi ini memfasilitasi pelaporan insiden secara *real-time*, pengelolaan jadwal ronda, serta komunikasi antar warga dan pengurus lingkungan.

Dilengkapi dengan kecerdasan buatan (**Google Gemini AI**), aplikasi ini memberikan analisis awal terhadap laporan keamanan dan menyediakan asisten virtual untuk tips keselamatan.

---

## ✨ Fitur Utama

### 1. 🚨 Pelaporan Insiden (Reporting)
*   Formulir pelaporan cepat untuk kejadian mencurigakan, tamu asing, atau pencurian.
*   **AI Analysis:** Integrasi dengan Gemini AI untuk memberikan saran keselamatan instan berdasarkan deskripsi laporan.
*   Geotagging lokasi kejadian.
*   Status pelacakan laporan (Pending -> Diproses -> Selesai).

### 2. 📅 Manajemen Jadwal Ronda (Scheduling)
*   Kalender interaktif untuk melihat jadwal jaga.
*   Status kehadiran petugas (Terjadwal, Bertugas, Selesai).
*   **Admin:** Kemampuan untuk menambahkan jadwal manual dan memperbarui status petugas.

### 3. 💬 Forum Warga
*   Ruang diskusi untuk warga dengan kategori (Umum, Keamanan, Pengumuman).
*   Fitur Komentar dan *Like*.
*   **Moderasi Admin:** Admin (Ketua RT/RW) memiliki hak akses khusus untuk menghapus postingan yang tidak sesuai.

### 4. 📞 Kontak Darurat
*   Direktori telepon penting (Polisi, Damkar, Ambulans) dengan fitur *Click-to-Call*.
*   Daftar kontak pengurus lingkungan (RT, RW, Linmas).

### 5. 🤖 AI Safety Assistant
*   Chatbot cerdas yang dapat menjawab pertanyaan seputar keamanan lingkungan dan tips keselamatan.

---

## 🛠️ Teknologi yang Digunakan

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **AI Engine:** Google GenAI SDK (Gemini 2.5 Flash)
*   **Build/Environment:** ES Modules (ESM)

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat
1.  Node.js terinstal di komputer Anda.
2.  API Key dari [Google AI Studio](https://aistudio.google.com/).

### Instalasi & Setup

Karena proyek ini menggunakan struktur modern, Anda dapat menjalankannya menggunakan Vite.

1.  **Clone Repository** (atau salin file ke folder lokal).
2.  **Install Dependencies** (jika menggunakan `package.json`, namun kode ini dirancang untuk berjalan dengan `esm.sh` di lingkungan modern/browser). Jika Anda ingin menjalankannya secara lokal dengan Vite:

    ```bash
    npm create vite@latest siskamling-app -- --template react-ts
    cd siskamling-app
    npm install lucide-react @google/genai
    ```

3.  **Konfigurasi API Key**
    Buat file `.env` di root project dan tambahkan API Key Gemini Anda:
    ```env
    VITE_API_KEY=masukkan_api_key_google_anda_disini
    ```
    *(Catatan: Pastikan `process.env.API_KEY` di kode diganti dengan `import.meta.env.VITE_API_KEY` jika menggunakan Vite, atau konfigurasi bundler Anda sesuai kebutuhan).*

4.  **Jalankan Aplikasi**
    ```bash
    npm run dev
    ```

---

## 👥 Hak Akses Pengguna (Role)

Aplikasi ini memiliki simulasi login dengan dua peran utama:

| Fitur | Warga (Resident) | Admin (Ketua RT/RW) |
| :--- | :---: | :---: |
| Membuat Laporan | ✅ | ✅ |
| Melihat Jadwal Ronda | ✅ | ✅ |
| Posting di Forum | ✅ | ✅ |
| Komentar & Like | ✅ | ✅ |
| Chat dengan AI | ✅ | ✅ |
| **Mengubah Status Laporan** | ❌ | ✅ |
| **Mengelola Status Petugas** | ❌ | ✅ |
| **Menghapus Postingan Forum**| ❌ | ✅ |
| **Posting Pengumuman** | ❌ | ✅ |

---

## 📂 Struktur Proyek

```
/
├── components/       # Komponen UI (Dashboard, Forum, Schedule, dll)
├── services/         # Integrasi API (Gemini Service, Mock Data)
├── types.ts          # Definisi Tipe TypeScript
├── App.tsx           # Komponen Utama & Routing Logika
├── index.tsx         # Entry Point
├── index.html        # HTML Template & Import Maps
└── metadata.json     # Metadata aplikasi & permission
```

---

## 🔐 Keamanan & Privasi

*   Aplikasi meminta izin **Kamera** (untuk bukti foto), **Mikrofon** (opsional untuk fitur masa depan), dan **Geolokasi** (untuk lokasi laporan).
*   Data pengguna saat ini menggunakan *Mock Data* (data simulasi) untuk tujuan demonstrasi.

---

## 📝 Lisensi

Proyek ini dibuat untuk tujuan demonstrasi pengembangan web modern dengan integrasi AI.
