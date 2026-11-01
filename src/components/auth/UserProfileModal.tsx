import React, { useState } from 'react';
import {
  User,
  X,
  Camera,
  Shield,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CurrentAuthUser } from '../../types';

interface UserProfileModalProps {
  user: CurrentAuthUser;
  onClose: () => void;
  onSaveProfile: (updated: Partial<CurrentAuthUser>) => void;
  onOpenChangePassword: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  onSaveProfile,
  onOpenChangePassword,
}) => {
  const [fullName, setFullName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: fullName,
      phone,
      email,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 text-left my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-[#1E293B]">
              Profil Saya
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Kelola informasi akun dan keamanan pribadi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card with Avatar */}
        <div className="mt-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full ${user.avatarColor} flex items-center justify-center font-extrabold text-xl shadow-md`}>
              {user.avatarInitials}
            </div>
            <button
              type="button"
              onClick={() => alert('Simulasi: Dialog pemilihan foto profil')}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-slate-600 hover:text-emerald-700 transition"
              title="Ubah Foto Profil"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#1E293B] truncate">{user.name}</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">{user.title}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Login Terakhir: {user.lastLogin}
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Perubahan profil berhasil disimpan.</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-[#334155] mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 text-xs text-[#1E293B] outline-none"
            />
          </div>

          {/* Username (Read Only) & Role (Read Only) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">
                Username <span className="text-slate-400 font-normal">(Terkunci)</span>
              </label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-xs font-mono text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">
                Role Hak Akses
              </label>
              <input
                type="text"
                value={user.role}
                disabled
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Nomor HP */}
          <div>
            <label className="block text-xs font-bold text-[#334155] mb-1">
              Nomor Handphone / WhatsApp
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#E2E8F0] focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 text-xs text-[#1E293B] outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#334155] mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@pesantren.local"
                className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#E2E8F0] focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 text-xs text-[#1E293B] outline-none"
              />
            </div>
          </div>

          {/* Shortcut to change password */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenChangePassword();
              }}
              className="text-xs text-[#064E3B] hover:text-emerald-800 font-bold flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Ubah Password Akun</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition shadow-sm"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
