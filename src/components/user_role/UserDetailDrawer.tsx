import React from 'react';
import {
  X,
  Shield,
  KeyRound,
  UserX,
  Edit3,
  Clock,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  History,
  Lock,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { AppUser } from '../../types';

interface UserDetailDrawerProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: AppUser) => void;
  onResetPassword: (user: AppUser) => void;
  onDeactivate: (user: AppUser) => void;
  onViewActivity: (username: string) => void;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
  onResetPassword,
  onDeactivate,
  onViewActivity,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-base">
            <Shield className="h-5 w-5 text-emerald-700" />
            Detail Pengguna
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Profile Card */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className={`w-14 h-14 rounded-2xl ${user.avatarColor} flex items-center justify-center text-lg font-bold shadow-xs shrink-0`}>
              {user.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-800 truncate">{user.name}</h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    user.status === 'Aktif'
                      ? 'bg-emerald-100 text-emerald-800'
                      : user.status === 'Nonaktif'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      user.status === 'Aktif'
                        ? 'bg-emerald-600'
                        : user.status === 'Nonaktif'
                        ? 'bg-slate-500'
                        : 'bg-rose-600'
                    }`}
                  ></span>
                  {user.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user.title}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                <span className="text-slate-400 font-mono">@{user.username}</span>
                <span className="text-slate-300">•</span>
                <span className={user.role === 'Administrator' ? 'text-emerald-700' : user.role === 'Bendahara' ? 'text-blue-700' : 'text-purple-700'}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Informasi Pengguna
            </h4>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-slate-400" /> Role Akses
                </span>
                <span className="font-semibold text-slate-800">{user.role}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> Nomor HP
                </span>
                <span className="font-medium text-slate-800">{user.phone || '-'}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> Email
                </span>
                <span className="font-medium text-slate-800">{user.email || '-'}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> Akun Dibuat
                </span>
                <span className="font-medium text-slate-800">{user.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Aktivitas Terakhir
              </h4>
              <button
                onClick={() => onViewActivity(user.username)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                Lihat Semua Log <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800">{user.lastActivity}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Modul: {user.lastActivityModule} • {user.lastLogin}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Total Aksi Tercatat</span>
                <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {user.totalActionsCount} transaksi
                </span>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Informasi Keamanan & Login
            </h4>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> Terakhir Login
                </span>
                <span className="font-medium text-slate-800">{user.lastLogin}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-slate-400" /> Password Terakhir Diubah
                </span>
                <span className="font-medium text-slate-800">{user.passwordChangedAt}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-slate-400" /> Percobaan Gagal
                </span>
                <span className={`font-semibold ${user.failedLoginCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {user.failedLoginCount > 0 ? `${user.failedLoginCount} kali gagal` : '0 (Normal)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/70 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onEdit(user)}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5 text-slate-500" />
              Edit Profil
            </button>
            <button
              onClick={() => onResetPassword(user)}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <KeyRound className="h-3.5 w-3.5 text-amber-600" />
              Reset Password
            </button>
          </div>

          <button
            onClick={() => onDeactivate(user)}
            className={`w-full px-3 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
              user.status === 'Aktif'
                ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
            }`}
          >
            <UserX className="h-3.5 w-3.5" />
            {user.status === 'Aktif' ? 'Nonaktifkan Pengguna' : 'Aktifkan Kembali Pengguna'}
          </button>
        </div>
      </div>
    </div>
  );
};
