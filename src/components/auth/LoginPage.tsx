import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  ShieldAlert,
  UserPlus,
  Wallet,
  Award,
  Mail,
  Phone,
  BadgeCheck,
} from 'lucide-react';
import { CurrentAuthUser, UserRoleType } from '../../types';
import { initialAuthUsers } from '../../data/authData';
import { useInstitutionIdentity } from '../../utils/institutionStorage';
import {
  getAllAuthUsers,
  registerNewUser,
  StoredAuthUser,
} from '../../utils/userAuthStorage';

interface LoginPageProps {
  onLoginSuccess: (user: CurrentAuthUser) => void;
  onAccountStatusBlocked?: (user: CurrentAuthUser) => void;
  onFirstLoginRequired?: (user: CurrentAuthUser) => void;
  onRequestForgotPassword?: () => void;
  onOpenForgotPassword?: () => void;
  onOpenSystemStatus?: (statusType: 'error' | '404' | 'maintenance') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onAccountStatusBlocked,
  onFirstLoginRequired,
  onRequestForgotPassword,
  onOpenForgotPassword,
  onOpenSystemStatus,
}) => {
  const { identity } = useInstitutionIdentity();

  // Mode: login or register
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // List of all users (static + dynamic registered)
  const [allUsersList, setAllUsersList] = useState<StoredAuthUser[]>(() => getAllAuthUsers());

  useEffect(() => {
    const handleUsersUpdated = () => {
      setAllUsersList(getAllAuthUsers());
    };
    window.addEventListener('simkeu-auth-users-updated', handleUsersUpdated);
    return () => window.removeEventListener('simkeu-auth-users-updated', handleUsersUpdated);
  }, []);

  // Login Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRoleType>('Bendahara');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regShowConfirm, setRegShowConfirm] = useState(false);
  const [regAgreement, setRegAgreement] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccessUser, setRegSuccessUser] = useState<StoredAuthUser | null>(null);

  const handleForgotPasswordClick = () => {
    if (onRequestForgotPassword) {
      onRequestForgotPassword();
    } else if (onOpenForgotPassword) {
      onOpenForgotPassword();
    }
  };

  // Submit Login Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setUsernameError(null);
    setPasswordError(null);
    setAuthError(null);

    let hasError = false;
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setUsernameError('Username wajib diisi.');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Password wajib diisi.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const currentUsers = getAllAuthUsers();
      const foundUser = currentUsers.find(
        (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
      );

      // Check if credentials match (password matches registered pass or demo passwords)
      const isPasswordValid =
        foundUser &&
        (password === foundUser.passwordHash ||
          password === 'admin123' ||
          password === 'bendahara123' ||
          password === 'pimpinan123' ||
          password === 'password123' ||
          password === 'temp123');

      if (!foundUser || !isPasswordValid) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= 5) {
          const lockedDemoUser: CurrentAuthUser = foundUser || {
            id: 'USR-LOCKED',
            name: cleanUsername,
            username: cleanUsername,
            role: 'Bendahara',
            title: 'Staf Keuangan',
            status: 'Terkunci',
            phone: '-',
            email: `${cleanUsername}@pesantren.local`,
            avatarColor: 'bg-red-600 text-white',
            avatarInitials: cleanUsername.substring(0, 2).toUpperCase(),
            lastLogin: 'Baru saja',
            failedAttempts: 5,
            lockUntil: Date.now() + 30 * 60 * 1000,
          };
          if (onAccountStatusBlocked) {
            onAccountStatusBlocked(lockedDemoUser);
          } else {
            setAuthError('Akun Anda terkunci karena telah gagal 5 kali.');
          }
          return;
        }

        setAuthError('Username atau password yang Anda masukkan tidak sesuai.');
        return;
      }

      // Check Account Status
      if (
        foundUser.status === 'Nonaktif' ||
        foundUser.status === 'Ditangguhkan' ||
        foundUser.status === 'Terkunci'
      ) {
        if (onAccountStatusBlocked) {
          onAccountStatusBlocked(foundUser);
        } else {
          setAuthError(`Akun ini sedang berstatus ${foundUser.status}.`);
        }
        return;
      }

      // Check First Login Requirement
      if (foundUser.isFirstLogin && onFirstLoginRequired) {
        onFirstLoginRequired(foundUser);
        return;
      }

      // Login Success
      onLoginSuccess(foundUser);
    }, 600);
  };

  // Submit Register Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    const cleanName = regName.trim();
    const cleanUsername = regUsername.trim();
    const cleanEmail = regEmail.trim();
    const cleanPhone = regPhone.trim();

    if (!cleanName) {
      setRegError('Nama lengkap wajib diisi.');
      return;
    }
    if (!cleanUsername) {
      setRegError('Username wajib diisi.');
      return;
    }
    if (cleanUsername.length < 3) {
      setRegError('Username minimal 3 karakter.');
      return;
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(cleanUsername)) {
      setRegError('Username hanya boleh berisi huruf, angka, titik, atau garis bawah (_).');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setRegError('Alamat email aktif wajib diisi.');
      return;
    }
    if (!cleanPhone) {
      setRegError('Nomor telepon / WhatsApp wajib diisi.');
      return;
    }
    if (!regPassword) {
      setRegError('Password wajib diisi.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password minimal 6 karakter.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }
    if (!regAgreement) {
      setRegError('Anda harus menyetujui pernyataan kerahasiaan & SOP keuangan.');
      return;
    }

    setIsRegistering(true);

    setTimeout(() => {
      setIsRegistering(false);
      const res = registerNewUser({
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        phone: cleanPhone,
        role: regRole,
        password: regPassword,
      });

      if (!res.success || !res.user) {
        setRegError(res.message);
        return;
      }

      setRegSuccessUser(res.user);
      setAllUsersList(getAllAuthUsers());
    }, 650);
  };

  const handleQuickFill = (userAccount: CurrentAuthUser & { passwordHash: string }) => {
    setAuthMode('login');
    setUsername(userAccount.username);
    setPassword(userAccount.passwordHash);
    setUsernameError(null);
    setPasswordError(null);
    setAuthError(null);
  };

  // Roles Definition for the registration selector
  const roleOptions: {
    role: UserRoleType;
    label: string;
    badge: string;
    badgeColor: string;
    sub: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      role: 'Administrator',
      label: 'Administrator',
      badge: 'Akses Penuh',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      sub: 'Kepala IT & Admin Sistem',
      description: 'Kelola seluruh modul, pengaturan identitas pesantren, rekening bank, dan hak akses user.',
      icon: ShieldCheck,
    },
    {
      role: 'Bendahara',
      label: 'Bendahara',
      badge: 'Kasir & Iuran',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      sub: 'Kasir & Staf Keuangan',
      description: 'Penerimaan SPP santri, tagihan bulanan, pencatatan pengeluaran kas, dan cetak kwitansi sah.',
      icon: Wallet,
    },
    {
      role: 'Pimpinan',
      label: 'Pimpinan',
      badge: 'Eksekutif & Audit',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      sub: 'Pimpinan & Pengawas Pondok',
      description: 'Monitoring dashboard eksekutif, rekapitulasi real-time, persetujuan belanja, dan audit fiskal.',
      icon: Award,
    },
  ];

  // Extra registered users (for quick selector preview)
  const newlyRegisteredUsers = allUsersList.filter(
    (u) => !initialAuthUsers.some((init) => init.id === u.id)
  );

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] font-sans antialiased text-slate-800 selection:bg-emerald-200">
      {/* ================= LEFT SIDE: INSTITUTION BRANDING ================= */}
      <div className="lg:w-[46%] bg-[#064E3B] text-white flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden shrink-0">
        {/* Subtle Islamic Geometric Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #10B981 1px, transparent 1px), radial-gradient(circle at 0% 100%, #10B981 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Decorative ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Institution Logo & Name */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-2xl shadow-inner overflow-hidden">
              {identity.logoUrl ? (
                <img
                  src={identity.logoUrl}
                  alt={identity.shortName || 'Logo'}
                  className="w-full h-full object-contain p-1 bg-white/90 rounded-lg"
                />
              ) : (
                <span className="text-emerald-300 font-serif">R</span>
              )}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-300/90 leading-tight">
                {identity.name || 'PM. RAUDHATUSSALAM MAHATO'}
              </p>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white mt-0.5">
                SIMKEU
              </h1>
              <p className="text-xs font-medium text-emerald-100/75">
                Sistem Informasi Keuangan Pesantren
              </p>
            </div>
          </div>
        </div>

        {/* Center: Hero Message */}
        <div className="my-8 lg:my-0 relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs font-semibold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Tahun Ajaran 2026/2027 Aktif
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight text-white tracking-tight">
            "Keuangan yang Tertata, Pesantren yang Lebih Transparan."
          </h2>
          <p className="text-xs lg:text-sm text-emerald-100/80 mt-3 leading-relaxed font-normal">
            Platform tata kelola keuangan sentral untuk pencatatan tagihan, pembayaran SPP santri,
            manajemen kas rekening bank, dan pelaporan akuntabel bagi seluruh pemangku kepentingan.
          </p>

          <div className="mt-6 p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-700/50 backdrop-blur-xs">
            <p className="text-[11px] text-emerald-200 font-medium">
              💡 <span className="font-bold text-white">Registrasi Terbuka:</span> Anda dapat membuat akun baru dan menentukan peran akses Anda (Administrator, Bendahara, atau Pimpinan) sesuai tugas di pesantren.
            </p>
          </div>
        </div>

        {/* Bottom: 4 Key Feature Indicators */}
        <div className="relative z-10 pt-6 border-t border-emerald-700/60">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-100">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <Check className="w-3 h-3" />
              </div>
              <span>Data Terpusat</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-100">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <Check className="w-3 h-3" />
              </div>
              <span>Saldo Real-Time</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-100">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <Check className="w-3 h-3" />
              </div>
              <span>Role Multi-Akses</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-100">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <Check className="w-3 h-3" />
              </div>
              <span>Kwitansi Sah</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: AUTH FORM (LOGIN & REGISTER) ================= */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {/* Header / Security Badge & Preview Mode Buttons */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Enkripsi 256-Bit</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Uji Sistem:</span>
            <button
              type="button"
              onClick={() => onOpenSystemStatus?.('maintenance')}
              className="text-[10px] text-slate-600 hover:text-emerald-700 font-medium px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition"
              title="Coba Tampilan Maintenance"
            >
              Pemeliharaan
            </button>
            <button
              type="button"
              onClick={() => onOpenSystemStatus?.('404')}
              className="text-[10px] text-slate-600 hover:text-emerald-700 font-medium px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition"
              title="Coba Tampilan 404"
            >
              404
            </button>
            <button
              type="button"
              onClick={() => onOpenSystemStatus?.('error')}
              className="text-[10px] text-slate-600 hover:text-emerald-700 font-medium px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition"
              title="Coba Tampilan Error 500"
            >
              Error 500
            </button>
          </div>
        </div>

        {/* Center Card Container */}
        <div className={`w-full mx-auto my-4 transition-all duration-200 ${authMode === 'register' ? 'max-w-xl' : 'max-w-md'}`}>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 sm:p-7">
            {/* Top Mode Tabs: Masuk vs Daftar */}
            <div className="flex border-b border-slate-200 mb-6 -mt-1">
              <button
                type="button"
                id="tab-login"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                  setRegSuccessUser(null);
                }}
                className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm border-b-2 transition flex items-center justify-center gap-2 cursor-pointer ${
                  authMode === 'login'
                    ? 'border-[#064E3B] text-[#064E3B] bg-emerald-50/40 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Masuk (Login)</span>
              </button>
              <button
                type="button"
                id="tab-register"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError(null);
                }}
                className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm border-b-2 transition flex items-center justify-center gap-2 cursor-pointer ${
                  authMode === 'register'
                    ? 'border-[#064E3B] text-[#064E3B] bg-emerald-50/40 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun Baru</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold hidden sm:inline">
                  Pilih Role
                </span>
              </button>
            </div>

            {/* ================= CONDITION 1: REGISTRATION SUCCESS SCREEN ================= */}
            {authMode === 'register' && regSuccessUser ? (
              <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3.5 shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Pendaftaran Akun Berhasil!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Selamat, akun Anda telah berhasil didaftarkan dan langsung aktif dalam sistem keuangan pesantren.
                </p>

                {/* Profile Card Preview */}
                <div className="my-5 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-left">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shadow-xs shrink-0 ${regSuccessUser.avatarColor}`}>
                      {regSuccessUser.avatarInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {regSuccessUser.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {regSuccessUser.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        @{regSuccessUser.username} • {regSuccessUser.email}
                      </p>
                      <p className="text-[11px] font-medium text-emerald-800 mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        Status Akun: <span className="font-bold">Aktif</span> ({regSuccessUser.title})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => onLoginSuccess(regSuccessUser)}
                    className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/10 cursor-pointer"
                  >
                    <span>Masuk Langsung Sebagai {regSuccessUser.role}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-300" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setUsername(regSuccessUser.username);
                      setPassword('');
                      setRegSuccessUser(null);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Buka Form Login (Username Telah Terisi)
                  </button>
                </div>
              </div>
            ) : authMode === 'register' ? (
              /* ================= CONDITION 2: REGISTRATION FORM ================= */
              <div>
                <div className="mb-5 text-left">
                  <h3 className="text-xl font-black text-[#1E293B] tracking-tight">
                    Daftar Akun Baru
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Lengkapi data pengguna dan tentukan peran (*role*) Anda di pesantren.
                  </p>
                </div>

                {/* Register Error Alert */}
                {regError && (
                  <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-left animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 leading-snug">{regError}</p>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
                  {/* STEP 1: CHOOSE ROLE */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-[#334155]">
                        Pilih Peran / Role Anda <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-[#064E3B] font-semibold">
                        Hak akses disesuaikan
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {roleOptions.map((item) => {
                        const Icon = item.icon;
                        const isSelected = regRole === item.role;
                        return (
                          <div
                            key={item.role}
                            onClick={() => setRegRole(item.role)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#064E3B] bg-emerald-50/60 ring-2 ring-[#064E3B]/20 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'bg-[#064E3B] text-white'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${item.badgeColor}`}
                                >
                                  {item.badge}
                                </span>
                              </div>
                              <p
                                className={`text-xs font-bold leading-tight ${
                                  isSelected ? 'text-[#064E3B]' : 'text-slate-800'
                                }`}
                              >
                                {item.label}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-3">
                                {item.description}
                              </p>
                            </div>

                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[9px] text-slate-400 font-medium">
                                {isSelected ? 'Dipilih' : 'Klik untuk pilih'}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? 'border-[#064E3B] bg-[#064E3B] text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 2: NAMA LENGKAP & USERNAME */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#334155] mb-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="input-reg-name"
                          type="text"
                          value={regName}
                          onChange={(e) => {
                            setRegName(e.target.value);
                            if (regError) setRegError(null);
                          }}
                          placeholder="Ust. Fathur Rahman"
                          disabled={isRegistering}
                          className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#334155] mb-1">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <input
                          id="input-reg-username"
                          type="text"
                          value={regUsername}
                          onChange={(e) => {
                            setRegUsername(e.target.value.toLowerCase().trim());
                            if (regError) setRegError(null);
                          }}
                          placeholder="fathur.keuangan"
                          disabled={isRegistering}
                          className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STEP 3: EMAIL & NOMOR HP */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#334155] mb-1">
                        Email Aktif <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="input-reg-email"
                          type="email"
                          value={regEmail}
                          onChange={(e) => {
                            setRegEmail(e.target.value);
                            if (regError) setRegError(null);
                          }}
                          placeholder="fathur@pesantren.local"
                          disabled={isRegistering}
                          className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#334155] mb-1">
                        No. WhatsApp / HP <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          id="input-reg-phone"
                          type="tel"
                          value={regPhone}
                          onChange={(e) => {
                            setRegPhone(e.target.value);
                            if (regError) setRegError(null);
                          }}
                          placeholder="0812-3456-7890"
                          disabled={isRegistering}
                          className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STEP 4: PASSWORD & KONFIRMASI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#334155] mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="input-reg-password"
                          type={regShowPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => {
                            setRegPassword(e.target.value);
                            if (regError) setRegError(null);
                          }}
                          placeholder="Min. 6 karakter"
                          disabled={isRegistering}
                          className="w-full pl-9 pr-9 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10"
                        />
                        <button
                          type="button"
                          onClick={() => setRegShowPassword(!regShowPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {regShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#334155] mb-1">
                        Ulangi Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="input-reg-confirm"
                          type={regShowConfirm ? 'text' : 'password'}
                          value={regConfirmPassword}
                          onChange={(e) => {
                            setRegConfirmPassword(e.target.value);
                            if (regError) setRegError(null);
                          }}
                          placeholder="Ulangi password"
                          disabled={isRegistering}
                          className="w-full pl-9 pr-9 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10"
                        />
                        <button
                          type="button"
                          onClick={() => setRegShowConfirm(!regShowConfirm)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {regShowConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SOP AGREEMENT CHECKBOX */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={regAgreement}
                        onChange={(e) => setRegAgreement(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#064E3B] focus:ring-[#064E3B] cursor-pointer shrink-0"
                      />
                      <span className="text-[11px] text-slate-600 leading-snug">
                        Saya menyatakan data ini valid dan bersedia menjaga kerahasiaan data keuangan pesantren sesuai wewenang peran <span className="font-bold text-[#064E3B]">{regRole}</span>.
                      </span>
                    </label>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    id="btn-register-submit"
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/10 cursor-pointer disabled:opacity-70"
                  >
                    {isRegistering ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                        <span>Mendaftarkan Akun...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-emerald-300" />
                        <span>Daftar Akun Sebagai {regRole}</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <p className="text-xs text-slate-500">
                      Sudah memiliki akun?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setRegError(null);
                        }}
                        className="text-[#064E3B] font-bold hover:underline cursor-pointer"
                      >
                        Masuk di sini
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* ================= CONDITION 3: LOGIN FORM ================= */
              <div>
                <div className="mb-6 text-left">
                  <h3 className="text-2xl font-black text-[#1E293B] tracking-tight">
                    Selamat Datang
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                    Silakan masuk untuk mengakses Sistem Informasi Keuangan Pesantren.
                  </p>
                </div>

                {/* Error Alert Box */}
                {authError && (
                  <div
                    id="login-error-alert"
                    className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-left animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-red-900">Login Gagal</h4>
                      <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                        {authError}
                      </p>
                      {failedAttempts > 0 && (
                        <div className="mt-2 text-[11px] font-medium text-red-800 bg-red-100/80 px-2 py-1 rounded-md inline-block">
                          Percobaan login gagal: <span className="font-bold">{failedAttempts} dari 5</span>
                          {failedAttempts >= 3 && ' (Akun akan terkunci jika 5 kali gagal)'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Main Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Username Field */}
                  <div className="text-left">
                    <label className="block text-xs font-bold text-[#334155] mb-1.5">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="input-username"
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (usernameError) setUsernameError(null);
                          if (authError) setAuthError(null);
                        }}
                        placeholder="Masukkan username"
                        disabled={isLoading}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border text-xs sm:text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all outline-none focus:ring-2 ${
                          usernameError
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                            : 'border-[#E2E8F0] focus:border-[#064E3B] focus:ring-[#064E3B]/10 hover:border-slate-300'
                        }`}
                      />
                    </div>
                    {usernameError && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {usernameError}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="text-left">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#334155]">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPasswordClick}
                        className="text-xs text-[#064E3B] hover:text-emerald-800 font-bold hover:underline transition cursor-pointer"
                      >
                        Lupa Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="input-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError(null);
                          if (authError) setAuthError(null);
                        }}
                        placeholder="Masukkan password"
                        disabled={isLoading}
                        className={`w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border text-xs sm:text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all outline-none focus:ring-2 ${
                          passwordError
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                            : 'border-[#E2E8F0] focus:border-[#064E3B] focus:ring-[#064E3B]/10 hover:border-slate-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#334155] focus:outline-none cursor-pointer"
                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {passwordError}
                      </p>
                    )}
                  </div>

                  {/* Option: Remember Me */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#064E3B] focus:ring-[#064E3B] cursor-pointer"
                      />
                      <span className="text-xs text-[#475569] font-medium">Ingat saya</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Sesi 30 menit</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    id="btn-login-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/10 hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                        <span>Memverifikasi akun...</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk ke SIMKEU</span>
                        <ArrowRight className="w-4 h-4 text-emerald-300" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch to Register Banner */}
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-600">
                    Belum punya akun pengguna?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setAuthError(null);
                      }}
                      className="text-[#064E3B] font-bold hover:underline cursor-pointer"
                    >
                      Daftar Akun Baru (Pilih Role)
                    </button>
                  </p>
                </div>

                {/* Quick Demo Persona Switcher */}
                <div className="mt-5 pt-4 border-t border-slate-200 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Akses Cepat Akun Demo (Klik untuk Mengisi):
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickFill(initialAuthUsers[0])}
                      className="px-2 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-left transition group cursor-pointer"
                    >
                      <p className="text-[11px] font-bold text-emerald-900 leading-tight">
                        Admin
                      </p>
                      <p className="text-[9px] text-emerald-700 mt-0.5 truncate">
                        Ahmad Fauzi
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill(initialAuthUsers[1])}
                      className="px-2 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-left transition group cursor-pointer"
                    >
                      <p className="text-[11px] font-bold text-blue-900 leading-tight">
                        Bendahara
                      </p>
                      <p className="text-[9px] text-blue-700 mt-0.5 truncate">
                        Siti Rahmawati
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill(initialAuthUsers[2])}
                      className="px-2 py-1.5 rounded-lg border border-purple-200 bg-purple-50/70 hover:bg-purple-100/70 text-left transition group cursor-pointer"
                    >
                      <p className="text-[11px] font-bold text-purple-900 leading-tight">
                        Pimpinan
                      </p>
                      <p className="text-[9px] text-purple-700 mt-0.5 truncate">
                        KH. Syarifuddin
                      </p>
                    </button>
                  </div>

                  {/* Registered Users List if any */}
                  {newlyRegisteredUsers.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1.5 flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Akun Baru Terdaftar ({newlyRegisteredUsers.length}):
                      </p>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {newlyRegisteredUsers.map((regUser) => (
                          <div
                            key={regUser.id}
                            onClick={() => handleQuickFill(regUser)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 flex items-center justify-between cursor-pointer transition text-left"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-800 truncate">
                                {regUser.name} <span className="font-normal text-[10px] text-slate-500">(@{regUser.username})</span>
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                Role: <span className="font-semibold text-emerald-800">{regUser.role}</span>
                              </p>
                            </div>
                            <span className="text-[10px] text-[#064E3B] font-bold underline shrink-0 ml-2">
                              Pilih
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Edge Case Persona Test */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickFill(initialAuthUsers[6])}
                      className="text-[10px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                    >
                      Test: Login Pertama
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill(initialAuthUsers[5])}
                      className="text-[10px] px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-medium cursor-pointer"
                    >
                      Test: Terkunci
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill(initialAuthUsers[3])}
                      className="text-[10px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                    >
                      Test: Nonaktif
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Institutional Footer */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-200/80 pt-4">
          <p className="font-semibold text-slate-600">
            © 2026 PM. RAUDHATUSSALAM MAHATO
          </p>
          <p className="text-[11px] mt-0.5 text-slate-400">
            Sistem Informasi Keuangan • Terintegrasi, Transparan, dan Akuntabel
          </p>
        </div>
      </div>
    </div>
  );
};

