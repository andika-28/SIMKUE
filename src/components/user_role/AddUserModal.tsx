import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  KeyRound,
  Check,
  RefreshCw,
  Info,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AppUser, UserRoleType } from '../../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<AppUser>) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRoleType>('Bendahara');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setConfirmPassword(res);
    setShowPassword(true);
  };

  const hasMinLen = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!username.trim()) newErrors.username = 'Username wajib diisi';
    else if (!/^[a-z0-9_]+$/.test(username.trim())) {
      newErrors.username = 'Username hanya boleh huruf kecil, angka, dan garis bawah (_)';
    }

    if (!password) newErrors.password = 'Password wajib diisi';
    else if (!hasMinLen || !hasLetter || !hasNumber) {
      newErrors.password = 'Password tidak memenuhi standar keamanan';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const initials = fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const color =
      role === 'Administrator'
        ? 'bg-emerald-700 text-white'
        : role === 'Bendahara'
        ? 'bg-blue-600 text-white'
        : 'bg-purple-700 text-white';

    onSave({
      name: fullName.trim(),
      username: username.trim(),
      role,
      title: title.trim() || (role === 'Administrator' ? 'Admin Sistem' : role === 'Bendahara' ? 'Staf Keuangan' : 'Pimpinan Pesantren'),
      status,
      phone: phone.trim(),
      email: email.trim(),
      avatarInitials: initials,
      avatarColor: color,
      createdAt: '02 Sep 2026',
      lastLogin: 'Belum pernah login',
      lastActivity: 'Akun baru dibuat',
      lastActivityModule: 'User & Role',
      passwordChangedAt: '02 Sep 2026',
      failedLoginCount: 0,
      totalActionsCount: 0,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-700" />
              Tambah Pengguna Baru
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Buat akun baru untuk memberikan akses ke sistem SIMKEU Pesantren.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto">
          {/* Section 1: Informasi Pengguna */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">1</span>
              Informasi Pengguna
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder="Contoh: Muhammad Abdullah"
                  className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username Login <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.toLowerCase());
                    if (errors.username) setErrors({ ...errors, username: '' });
                  }}
                  placeholder="Contoh: abdullah"
                  className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors font-mono ${
                    errors.username ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.username ? (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.username}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Username digunakan untuk masuk ke sistem.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan / Posisi Spesifik
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Bendahara Kasir"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor HP (WhatsApp) <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@pesantren.local"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role & Hak Akses Utama */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">2</span>
              Penetapan Role Akses
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Role Pengguna <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['Administrator', 'Bendahara', 'Pimpinan'] as UserRoleType[]).map((r) => (
                  <label
                    key={r}
                    className={`flex items-start p-3 border rounded-xl cursor-pointer transition-all ${
                      role === r
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/30'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userRole"
                      checked={role === r}
                      onChange={() => setRole(r)}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="ml-2.5">
                      <span className="block text-xs font-bold text-slate-800">{r}</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        {r === 'Administrator' && 'Akses penuh seluruh sistem'}
                        {r === 'Bendahara' && 'Kelola transaksi & rekening'}
                        {r === 'Pimpinan' && 'Monitoring & pengawasan'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Dynamic Role Capability Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-emerald-700" />
                  Hak Akses Utama untuk Role: <span className="text-emerald-700">{role}</span>
                </span>
                <span className="text-[11px] text-slate-500">Prinsip RBAC SIMKEU</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Dashboard & KPI
                </div>
                <div className={`flex items-center gap-1.5 font-medium ${role !== 'Pimpinan' ? 'text-emerald-800' : 'text-slate-600'}`}>
                  {role !== 'Pimpinan' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Eye className="h-3.5 w-3.5 text-blue-600" />} Data Santri & Tagihan
                </div>
                <div className={`flex items-center gap-1.5 font-medium ${role !== 'Pimpinan' ? 'text-emerald-800' : 'text-slate-600'}`}>
                  {role !== 'Pimpinan' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Eye className="h-3.5 w-3.5 text-blue-600" />} Pencatatan Pengeluaran
                </div>
                <div className={`flex items-center gap-1.5 font-medium ${role !== 'Pimpinan' ? 'text-emerald-800' : 'text-slate-600'}`}>
                  {role !== 'Pimpinan' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Eye className="h-3.5 w-3.5 text-blue-600" />} Pembayaran & Bank
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Pusat Laporan (PDF/XLS)
                </div>
                <div className={`flex items-center gap-1.5 font-medium ${role === 'Administrator' ? 'text-emerald-800' : 'text-rose-600'}`}>
                  {role === 'Administrator' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-rose-500" />
                  )}
                  Pengaturan & User System
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Password & Keamanan */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">3</span>
                Password & Keamanan
              </div>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate Password Acak
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Masukkan password kuat"
                    className={`w-full pl-3.5 pr-10 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 font-mono ${
                      errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Konfirmasi Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  placeholder="Ulangi password"
                  className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 font-mono ${
                    errors.confirmPassword ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Password checklist */}
            <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium">Standar Keamanan:</span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${hasMinLen ? 'text-emerald-700' : 'text-slate-400'}`}>
                <Check className={`h-3 w-3 ${hasMinLen ? 'text-emerald-600' : 'text-slate-300'}`} /> Min. 8 Karakter
              </span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${hasLetter ? 'text-emerald-700' : 'text-slate-400'}`}>
                <Check className={`h-3 w-3 ${hasLetter ? 'text-emerald-600' : 'text-slate-300'}`} /> Mengandung Huruf
              </span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${hasNumber ? 'text-emerald-700' : 'text-slate-400'}`}>
                <Check className={`h-3 w-3 ${hasNumber ? 'text-emerald-600' : 'text-slate-300'}`} /> Mengandung Angka
              </span>
            </div>
          </div>

          {/* Section 4: Status Akun */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">4</span>
              Status Akun
            </div>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="userStatus"
                  value="Aktif"
                  checked={status === 'Aktif'}
                  onChange={() => setStatus('Aktif')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Aktif (Dapat langsung login)
                </span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="userStatus"
                  value="Nonaktif"
                  checked={status === 'Nonaktif'}
                  onChange={() => setStatus('Nonaktif')}
                  className="text-slate-600 focus:ring-slate-500"
                />
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Nonaktif (Akses ditangguhkan)
                </span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#043d2e] rounded-lg shadow-xs hover:shadow-md transition-all flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Simpan Pengguna
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
