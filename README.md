# ⚡ Premium To-Do List, Habit Tracker & Productivity Dashboard

Aplikasi manajemen tugas, pelacak kebiasaan (*habit tracker*), dan catatan tempel (*sticky wall*) modern dengan estetika premium yang dirancang untuk meningkatkan produktivitas harian Anda. Proyek ini dibangun menggunakan teknologi web modern paling mutakhir: **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **TypeScript**, dan **Framer Motion**.

---

## ✨ Fitur Utama

Aplikasi ini tidak hanya sekadar daftar tugas biasa, melainkan sebuah pusat produktivitas (*productivity hub*) pribadi yang mencakup berbagai modul interaktif:

1. **📊 Dashboard Interaktif**
   * Panel ringkasan yang menampilkan metrik produktivitas Anda secara *real-time*.
   * Tampilan tugas hari ini (*Today's Tasks*), pelacakan kebiasaan aktif (*Habit Logs*), dan statistik penyelesaian tugas.

2. **✅ Manajemen Tugas Tingkat Lanjut (*Advanced Task Management*)**
   * Kelola tugas dengan prioritas kustom (**High**, **Medium**, **Low**).
   * Tambahkan tenggat waktu (*deadline*), waktu mulai (*start time*), serta durasi tugas.
   * Dukungan untuk pembuatan **sub-tugas (*subtasks*)** interaktif.
   * Kelompokkan tugas ke dalam **Daftar Kategori (*Custom Lists*)** dan **Label (*Tags*)** dengan warna yang dapat disesuaikan.

3. **🧘 Pelacak Kebiasaan (*Habit Tracker*)**
   * Terapkan dan lacak kebiasaan harian (*daily*) atau mingguan (*weekly*).
   * Pilih ikon representatif dan warna kustom untuk setiap kebiasaan.
   * Visualisasi riwayat pencapaian (*habit completion logs*) yang interaktif.

4. **📌 Sticky Wall (Catatan Tempel)**
   * Media *brainstorming* visual untuk menuangkan ide-ide cepat Anda secara kreatif.
   * Kartu catatan dengan berbagai pilihan warna estetik yang dapat ditambah, diedit, dan dihapus dengan mudah.

5. **📅 Tampilan Kalender (*Calendar View*)**
   * Kalender bulanan yang dinamis dan elegan untuk menjadwalkan tugas.
   * Klik pada tanggal atau tugas tertentu untuk melihat detail dan melakukan pembaruan secara instan.

6. **⚙️ Personalisasi & Kustomisasi Tampilan**
   * **Mode Gelap & Terang (Dark / Light Mode)** yang nyaman di mata.
   * **Gaya Glassmorphism**: Desain transparan modern yang futuristik dan premium.
   * **Mode Padat (Compact Mode)**: Menyesuaikan tata letak agar lebih ringkas dan memuat lebih banyak informasi di layar.

7. **🔒 Halaman Autentikasi**
   * Desain halaman Login dan Registrasi modern dengan transisi yang halus.

8. **💾 Sinkronisasi & Persistensi Data**
   * Seluruh data tugas, kebiasaan, catatan, list, tag, dan preferensi tampilan tersimpan secara otomatis dan aman di penyimpanan lokal peramban Anda menggunakan **LocalStorage**.

---

## 🛠️ Teknologi yang Digunakan

Aplikasi ini menggunakan kombinasi pustaka modern berperforma tinggi untuk menghadirkan pengalaman pengguna yang luar biasa:

* **Framework Utama:** [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
* **Bahasa Pemrograman:** [TypeScript](https://www.typescriptlang.org/)
* **Gaya & Estetika (Styling):** [Tailwind CSS v4](https://tailwindcss.com/) dengan kombinasi efek Glassmorphic dan transisi modern.
* **Ikonografi:** [Lucide React](https://lucide.dev/) untuk ikon-ikon antarmuka berkualitas premium.
* **Animasi:** [Framer Motion](https://www.framer.com/motion/) untuk transisi halaman dan interaksi mikro (*micro-animations*) yang halus.
* **Utilitas Tanggal:** [date-fns](https://date-fns.org/) untuk kalkulasi dan pemrosesan tanggal secara akurat.
* **ID Generator:** [uuid](https://github.com/uuidjs/uuid) untuk pembuatan pengidentifikasi unik pada entitas data.

---

## 📁 Struktur Proyek

Arsitektur kode diatur dengan rapi di dalam direktori `src` untuk memfasilitasi skalabilitas dan keterbacaan kode:

```text
src/
├── app/                  # File Next.js App Router (Layouts, Pages, Styles)
│   ├── auth/             # Halaman autentikasi (Login & Register)
│   ├── globals.css       # Konfigurasi gaya CSS global dan variabel Tailwind CSS v4
│   ├── layout.tsx        # Layout utama aplikasi
│   └── page.tsx          # Halaman beranda (kontrol utama view/dashboard)
├── components/           # Komponen UI modular
│   ├── auth/             # Komponen pendukung autentikasi
│   ├── CalendarView.tsx  # Modul kalender interaktif
│   ├── DashboardView.tsx # Modul panel ringkasan (dashboard)
│   ├── HabitTrackerView.tsx # Modul pelacak kebiasaan
│   ├── SettingsView.tsx  # Modul preferensi tampilan dan pengaturan
│   ├── Sidebar.tsx       # Menu navigasi samping utama
│   ├── StickyWall.tsx    # Modul catatan tempel
│   ├── TaskDetails.tsx   # Panel edit detail tugas secara mendalam
│   ├── TaskInput.tsx     # Form input cepat untuk menambahkan tugas
│   ├── TaskItem.tsx      # Komponen baris tugas tunggal
│   └── ThemeToggle.tsx   # Tombol toggle tema
├── hooks/                # Custom React Hooks
│   ├── useLocalStorage.ts# Hook helper untuk persistensi data di LocalStorage
│   └── useTasks.ts       # Hook state manajemen utama untuk tugas, kebiasaan, catatan, list, dan tag
└── types/                # Definisi tipe data TypeScript
    └── todo.ts           # Definisi tipe data/interface (Task, Habit, Note, dll.)
```

---

## 🚀 Cara Memulai

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di lingkungan lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 18.x atau yang lebih baru direkomendasikan) di komputer Anda.

### 2. Instalasi Dependensi
Clone proyek ini, masuk ke direktori utama, lalu jalankan perintah berikut untuk menginstal semua pustaka yang diperlukan:

```bash
npm install
```

### 3. Menjalankan Server Pengembangan
Jalankan server lokal dalam mode pengembangan. Proyek ini telah dikonfigurasi untuk berjalan di **port 3011**:

```bash
npm run dev
```

Buka peramban Anda dan akses **[http://localhost:3011](http://localhost:3011)** untuk melihat hasilnya.

### 4. Melakukan Build untuk Produksi
Untuk mengoptimalkan performa aplikasi sebelum dideploy ke server produksi, jalankan perintah pembuatan bundel (*build bundle*):

```bash
npm run build
```

Setelah proses build selesai, Anda dapat menjalankan aplikasi dalam mode produksi dengan perintah:

```bash
npm run start
```

---

## 💡 Arsitektur Manajemen State

Aplikasi ini menggunakan pendekatan **React Hooks Kustom (`useTasks`)** sebagai *central state manager*. Seluruh state aplikasi dikontrol secara terpusat, meminimalkan *prop drilling* yang berlebihan, dan dipetakan secara reaktif ke hook `useLocalStorage`. Pendekatan ini memastikan bahwa:
1. **Kecepatan & Responsivitas:** Tidak ada latensi jaringan karena data diproses langsung di sisi klien (*client-side*).
2. **Kemandirian Data:** Pengguna memiliki kontrol penuh atas data mereka yang tersimpan secara lokal.
3. **Pemberitahuan Reaktif:** Perubahan pengaturan tampilan seperti tema gelap atau mode glassmorphism akan langsung diterapkan ke seluruh elemen antarmuka secara instan.

---

## 🎨 Panduan Kontribusi

Kontribusi selalu terbuka untuk meningkatkan kualitas dan fitur aplikasi ini!
1. Fork repositori ini.
2. Buat *feature branch* baru (`git checkout -b fitur/FiturKeren`).
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4. Push ke branch tersebut (`git push origin fitur/FiturKeren`).
5. Buat *Pull Request* baru untuk ditinjau.
