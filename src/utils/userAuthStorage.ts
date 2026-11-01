import { CurrentAuthUser, UserRoleType } from '../types';
import { initialAuthUsers } from '../data/authData';

const REGISTERED_USERS_KEY = 'simkeu_registered_auth_users';
const EVENT_USERS_UPDATED = 'simkeu-auth-users-updated';

export type StoredAuthUser = CurrentAuthUser & { passwordHash: string };

/**
 * Get all users including initial static demo accounts and custom registered accounts
 */
export function getAllAuthUsers(): StoredAuthUser[] {
  if (typeof window === 'undefined') {
    return initialAuthUsers;
  }

  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    const customUsers: StoredAuthUser[] = raw ? JSON.parse(raw) : [];

    // Combine initial users with registered users, avoiding duplicate IDs or usernames
    const combined: StoredAuthUser[] = [...initialAuthUsers];
    for (const custom of customUsers) {
      const existingIndex = combined.findIndex(
        (u) => u.username.toLowerCase() === custom.username.toLowerCase()
      );
      if (existingIndex >= 0) {
        combined[existingIndex] = custom;
      } else {
        combined.push(custom);
      }
    }
    return combined;
  } catch (err) {
    console.error('Error loading registered users from localStorage:', err);
    return initialAuthUsers;
  }
}

/**
 * Register a new user with their chosen role
 */
export function registerNewUser(data: {
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRoleType;
  password: string;
}): { success: boolean; message: string; user?: StoredAuthUser } {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Lingkungan browser tidak tersedia.' };
  }

  const cleanName = data.name.trim();
  const cleanUsername = data.username.trim().toLowerCase();
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanPhone = data.phone.trim();
  const password = data.password;

  if (!cleanName) {
    return { success: false, message: 'Nama lengkap wajib diisi.' };
  }
  if (!cleanUsername) {
    return { success: false, message: 'Username wajib diisi.' };
  }
  if (cleanUsername.length < 3) {
    return { success: false, message: 'Username minimal 3 karakter.' };
  }
  if (!/^[a-zA-Z0-9_.]+$/.test(cleanUsername)) {
    return { success: false, message: 'Username hanya boleh berisi huruf, angka, titik, atau garis bawah (_).' };
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Format alamat email tidak valid.' };
  }
  if (!password || password.length < 6) {
    return { success: false, message: 'Password minimal 6 karakter.' };
  }

  const currentUsers = getAllAuthUsers();

  // Check username collision
  if (currentUsers.some((u) => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, message: `Username "${cleanUsername}" sudah digunakan. Silakan pilih username lain.` };
  }

  // Check email collision
  if (currentUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, message: `Email "${cleanEmail}" sudah terdaftar pada akun lain.` };
  }

  // Derive title, avatar initials, and avatar color based on chosen role
  let roleTitle = 'Staf Keuangan Pesantren';
  let avatarColor = 'bg-blue-600 text-white';

  if (data.role === 'Administrator') {
    roleTitle = 'Administrator Sistem & IT';
    avatarColor = 'bg-emerald-700 text-white';
  } else if (data.role === 'Bendahara') {
    roleTitle = 'Bendahara & Pengelola Kasir';
    avatarColor = 'bg-blue-600 text-white';
  } else if (data.role === 'Pimpinan') {
    roleTitle = 'Pimpinan & Pengawas Keuangan';
    avatarColor = 'bg-purple-700 text-white';
  }

  const nameWords = cleanName.split(' ').filter(Boolean);
  let initials = cleanName.substring(0, 2).toUpperCase();
  if (nameWords.length >= 2) {
    initials = (nameWords[0][0] + nameWords[1][0]).toUpperCase();
  }

  const newUserId = `USR-REG-${Date.now().toString().slice(-4)}`;

  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const newUser: StoredAuthUser = {
    id: newUserId,
    name: cleanName,
    username: cleanUsername,
    role: data.role,
    title: roleTitle,
    status: 'Aktif',
    phone: cleanPhone || '0812-0000-0000',
    email: cleanEmail,
    avatarColor,
    avatarInitials: initials,
    lastLogin: `${dateStr}, ${timeStr} WIB`,
    isFirstLogin: false,
    failedAttempts: 0,
    passwordHash: password,
  };

  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    const existingList: StoredAuthUser[] = raw ? JSON.parse(raw) : [];
    existingList.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existingList));

    window.dispatchEvent(
      new CustomEvent(EVENT_USERS_UPDATED, {
        detail: newUser,
      })
    );

    return {
      success: true,
      message: `Akun untuk ${cleanName} dengan role ${data.role} berhasil didaftarkan!`,
      user: newUser,
    };
  } catch (err) {
    console.error('Failed to save user in localStorage:', err);
    return { success: false, message: 'Gagal menyimpan data pendaftaran ke penyimpanan browser.' };
  }
}
