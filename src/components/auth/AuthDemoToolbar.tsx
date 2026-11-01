import React, { useState, useEffect } from 'react';
import {
  Shield,
  User,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
  UserX,
  ShieldAlert,
  KeyRound,
  AlertOctagon,
  SearchX,
  Wrench,
  History,
  Bell,
  LogOut,
  AlertCircle,
  Eye,
  BadgeCheck,
} from 'lucide-react';
import { CurrentAuthUser, UserRoleType } from '../../types';
import { initialAuthUsers } from '../../data/authData';
import { getAllAuthUsers, StoredAuthUser } from '../../utils/userAuthStorage';

interface AuthDemoToolbarProps {
  currentUser: CurrentAuthUser | null;
  onSwitchUser: (user: CurrentAuthUser) => void;
  onTriggerState: (stateName: string) => void;
  onLogout: () => void;
}

export const AuthDemoToolbar: React.FC<AuthDemoToolbarProps> = ({
  currentUser,
  onSwitchUser,
  onTriggerState,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [allUsersList, setAllUsersList] = useState<StoredAuthUser[]>(() => getAllAuthUsers());

  useEffect(() => {
    const handleUpdate = () => {
      setAllUsersList(getAllAuthUsers());
    };
    window.addEventListener('simkeu-auth-users-updated', handleUpdate);
    return () => window.removeEventListener('simkeu-auth-users-updated', handleUpdate);
  }, []);

  const newlyRegisteredUsers = allUsersList.filter(
    (u) => !initialAuthUsers.some((init) => init.id === u.id)
  );

  return (
    <div className="fixed bottom-3 right-3 z-40 font-sans antialiased text-left select-none">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-4 text-xs animate-in zoom-in-95 duration-150 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-[#064E3B]">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Pengendali Skenario & Autentikasi UX</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Current Persona Status */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
              Status Sesi Saat Ini:
            </p>
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{currentUser.name}</span>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    Role: {currentUser.role}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="text-slate-500 font-medium">
                Belum login (Berada di Halaman Login)
              </div>
            )}
          </div>

          {/* 1. Switch Role / Persona */}
          <div className="mt-3">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
              1. Beralih Role / Pengguna:
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onSwitchUser(initialAuthUsers[0])} // Admin
                className={`p-2 rounded-xl border text-left transition ${
                  currentUser?.username === 'admin'
                    ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B] font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold text-[11px]">Admin</div>
                <div className="text-[9px] text-slate-500 truncate">Ahmad Fauzi</div>
              </button>

              <button
                type="button"
                onClick={() => onSwitchUser(initialAuthUsers[1])} // Bendahara
                className={`p-2 rounded-xl border text-left transition ${
                  currentUser?.username === 'bendahara1'
                    ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B] font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold text-[11px]">Bendahara</div>
                <div className="text-[9px] text-slate-500 truncate">Siti Rahmawati</div>
              </button>

              <button
                type="button"
                onClick={() => onSwitchUser(initialAuthUsers[2])} // Pimpinan
                className={`p-2 rounded-xl border text-left transition ${
                  currentUser?.username === 'pimpinan'
                    ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B] font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold text-[11px]">Pimpinan</div>
                <div className="text-[9px] text-slate-500 truncate">KH. Syarifuddin</div>
              </button>
            </div>

            {newlyRegisteredUsers.length > 0 && (
              <div className="mt-2 pt-2 border-t border-dashed border-slate-200">
                <p className="text-[10px] uppercase font-bold text-emerald-800 mb-1 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3 text-emerald-600" />
                  Akun Didaftarkan Sendiri:
                </p>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {newlyRegisteredUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => onSwitchUser(u)}
                      className={`w-full p-1.5 rounded-lg border text-left flex items-center justify-between transition ${
                        currentUser?.username === u.username
                          ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate min-w-0 pr-2">
                        <span className="font-bold text-[11px]">{u.name}</span>
                        <span className="text-[9px] text-slate-500 ml-1">(@{u.username})</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Authentication Flow & Status Screens */}
          <div className="mt-3">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
              2. Uji Status Akun & Alur Autentikasi:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onTriggerState('first_login')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">Login Pertama (Ganti PW)</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('locked')}
                className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-left flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="truncate">Akun Terkunci (5x Gagal)</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('inactive')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5"
              >
                <UserX className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">Akun Nonaktif</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('suspended')}
                className="p-1.5 rounded-lg border border-amber-200 hover:bg-amber-50 text-amber-800 text-left flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Akun Ditangguhkan</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('timeout_warning')}
                className="p-1.5 rounded-lg border border-amber-200 hover:bg-amber-50 text-amber-800 text-left flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Peringatan Timeout</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('session_expired')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">Sesi Telah Berakhir</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('unsaved_changes')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Data Belum Disimpan</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('access_denied')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="truncate">Akses Ditolak (403)</span>
              </button>
            </div>
          </div>

          {/* 3. System States & Tools */}
          <div className="mt-3">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
              3. Modal Keamanan & Halaman Sistem:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onTriggerState('profile_modal')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">Profil Saya</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('change_password')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">Ubah Password</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('admin_reset_password')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span className="truncate">Admin Reset PW</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('audit_log')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span className="truncate">Audit Log Auth</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('error_500')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="truncate">Error Page (500)</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('not_found_404')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5"
              >
                <SearchX className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">404 Not Found</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerState('maintenance')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex items-center gap-1.5 col-span-2"
              >
                <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Sistem Dalam Pemeliharaan (Maintenance)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 rounded-full bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-xs shadow-xl flex items-center gap-2 border border-emerald-400/40 transition hover:scale-105 active:scale-95 cursor-pointer"
        title="Buka Pengendali Simulasi Auth SIMKEU"
      >
        <Shield className="w-4 h-4 text-emerald-300" />
        <span className="hidden sm:inline">Pengendali Auth UX</span>
        <span className="inline sm:hidden">Auth UX</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
