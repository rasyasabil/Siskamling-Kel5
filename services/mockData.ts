
import { Report, Shift, ForumPost, Contact, User, AppNotification } from '../types';

// Helper to get dynamic dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const toDateString = (date: Date) => date.toISOString().split('T')[0];

export const MOCK_USERS: User[] = [
  {
    id: 'u_admin',
    name: 'Pak Budi (Ketua RT)',
    email: 'admin@siskamling.id',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Pak+Budi&background=0D8ABC&color=fff'
  },
  {
    id: 'u_resident',
    name: 'Ibu Siti (Warga)',
    email: 'warga@siskamling.id',
    role: 'resident',
    avatar: 'https://ui-avatars.com/api/?name=Ibu+Siti&background=random'
  }
];

export const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    type: 'suspicious',
    description: 'Ada orang tidak dikenal mondar-mandir di depan rumah Pak RT.',
    location: 'Jl. Merpati No. 1',
    status: 'processed',
    timestamp: Date.now() - 3600000,
    reporterName: 'Budi'
  },
  {
    id: '2',
    type: 'guest',
    description: 'Tamu menginap 3 orang di rumah kontrakan No. 12.',
    location: 'Gg. Kutilang',
    status: 'pending',
    timestamp: Date.now() - 7200000,
    reporterName: 'Siti'
  }
];

export const MOCK_SHIFTS: Shift[] = [
  {
    id: 's1',
    userId: 'u1',
    userName: 'Pak Joko',
    date: toDateString(today),
    startTime: '22:00',
    endTime: '02:00',
    status: 'active'
  },
  {
    id: 's2',
    userId: 'u2',
    userName: 'Pak Asep',
    date: toDateString(today),
    startTime: '22:00',
    endTime: '02:00',
    status: 'active'
  },
  {
    id: 's3',
    userId: 'u3',
    userName: 'Pak Budi',
    date: toDateString(tomorrow),
    startTime: '22:00',
    endTime: '02:00',
    status: 'scheduled'
  }
];

export const MOCK_POSTS: ForumPost[] = [
  {
    id: 'p1',
    authorId: 'a1',
    authorName: 'Ketua RW 02',
    authorAvatar: '',
    category: 'announcement',
    title: 'Kerja Bakti Minggu Ini',
    content: 'Mohon partisipasi seluruh warga untuk membersihkan selokan utama pada hari Minggu besok pukul 07.00 WIB.',
    timestamp: Date.now() - 86400000,
    likes: 12,
    isLiked: false,
    isReported: false,
    comments: [
      {
        id: 'c1',
        authorName: 'Pak RT',
        authorAvatar: 'https://ui-avatars.com/api/?name=Pak+RT&background=random',
        content: 'Siap Pak RW, saya akan mengerahkan warga RT 05.',
        timestamp: Date.now() - 82000000
      },
      {
        id: 'c2',
        authorName: 'Ibu Ani',
        authorAvatar: 'https://ui-avatars.com/api/?name=Ibu+Ani&background=random',
        content: 'Apakah perlu membawa peralatan sendiri?',
        timestamp: Date.now() - 80000000
      }
    ]
  },
  {
    id: 'p2',
    authorId: 'a2',
    authorName: 'Andi',
    authorAvatar: '',
    category: 'security',
    title: 'Lampu Jalan Mati',
    content: 'Lampu penerangan di ujung gang 3 mati total, mohon segera diperbaiki karena gelap sekali kalau malam.',
    timestamp: Date.now() - 172800000,
    likes: 5,
    isLiked: true,
    isReported: false,
    comments: [
      {
        id: 'c3',
        authorName: 'Kang Ujang',
        authorAvatar: 'https://ui-avatars.com/api/?name=Kang+Ujang&background=22c55e&color=fff',
        content: 'Akan saya cek nanti malam saat ronda.',
        timestamp: Date.now() - 170000000
      }
    ]
  }
];

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Polsek Terdekat', role: 'Kepolisian', phone: '110', isEmergency: true },
  { id: 'c2', name: 'Pos Pemadam', role: 'Damkar', phone: '113', isEmergency: true },
  { id: 'c3', name: 'Ambulans', role: 'Medis', phone: '118', isEmergency: true },
  { id: 'c4', name: 'Bpk. Hartono', role: 'Ketua RT 05', phone: '081234567890', isEmergency: false },
  { id: 'c5', name: 'Bpk. Wijaya', role: 'Ketua RW 02', phone: '081298765432', isEmergency: false },
  { id: 'c6', name: 'Kang Ujang', role: 'Koordinator Linmas', phone: '081311223344', isEmergency: false },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Selamat Datang',
    message: 'Selamat datang di Siskamling Online. Mari jaga keamanan bersama.',
    type: 'info',
    timestamp: Date.now(),
    isRead: false
  },
  {
    id: 'n2',
    title: 'Jadwal Ronda',
    message: 'Jadwal ronda minggu ini telah diperbarui oleh Admin.',
    type: 'success',
    timestamp: Date.now() - 3600000,
    isRead: false
  }
];
