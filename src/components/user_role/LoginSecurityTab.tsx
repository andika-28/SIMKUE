import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  LogOut,
  Laptop,
  Globe,
  MapPin,
  Clock,
  KeyRound,
  UserX,
  Sparkles,
  Info,
  Shield,
  Hash,
} from 'lucide-react';
import { LoginHistoryRecord, ActiveUserSession } from '../../types';

interface LoginSecurityTabProps {
  loginHistory: LoginHistoryRecord[];
  activeSessions: ActiveUserSession[];
  onTerminateSession: (sessionId: string) => void;
  onLockUserAccount: (username: string) => void;
  onResetPasswordPrompt: (username: string) => void;
}

export const LoginSecurityTab: React.FC<LoginSecurityTabProps> = ({
  loginHistory,
  activeSessions,
  onTerminateSession,
  onLockUserAccount,
  onResetPasswordPrompt,
}) => {
  const [showSecurityAlert, setShowSecurityAlert] = useState(true);

  const activeCount = 5;
  const loginTodayCount = 12;
  const failedCount = loginHistory.filter((l) => l.status === 'GAGAL' || l.status === 'DIBLOKIR').length;
  const lockedCount = 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            Login, Sesi & Keamanan Akun
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau status keamanan autentikasi, kelola sesi aktif, riwayat akses masuk, dan proteksi brute-force.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sistem Pengamanan Aktif (RBAC)
        </div>
      </div>

      {/* 4 Security Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{activeCount}</div>
            <div className="text-xs font-bold text-slate-600 mt-0.5">Pengguna Terdaftar</div>
            <div className="text-[11px] text-emerald-700">100% status aktif</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{loginTodayCount}</div>
            <div className="text-xs font-bold text-slate-600 mt-0.5">Login Hari Ini</div>
            <div className="text-[11px] text-blue-700">Sesi terotorisasi</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            failedCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
          }`}>
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{failedCount}</div>
            <div className="text-xs font-bold text-slate-600 mt-0.5">Login Gagal (24 Jam)</div>
            <div className="text-[11px] text-slate-500">Percobaan tidak sah</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{lockedCount}</div>
            <div className="text-xs font-bold text-slate-600 mt-0.5">Akun Terkunci</div>
            <div className="text-[11px] text-emerald-700">Kondisi aman (0 locked)</div>
          </div>
        </div>
      </div>

      {/* Suspicious Activity Warning Banner */}
      {showSecurityAlert && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                Peringatan Keamanan Autentikasi
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                  Perhatian
                </span>
              </h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Terdeteksi 1 upaya login gagal dari IP eksternal <strong>103.145.22.18</strong> menggunakan username tidak terdaftar. Sistem telah secara otomatis memblokir IP tersebut setelah batas percobaan terlampaui.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onResetPasswordPrompt('admin')}
              className="px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-xl transition-colors"
            >
              Cek Proteksi Akun
            </button>
            <button
              onClick={() => setShowSecurityAlert(false)}
              className="px-3 py-2 text-xs font-semibold text-amber-700 hover:text-amber-900"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Sesi Aktif (Active Sessions) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Laptop className="h-4 w-4 text-emerald-700" />
              Sesi Login yang Sedang Aktif
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar perangkat yang saat ini memiliki token sesi terautentikasi ke SIMKEU.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {activeSessions.length} Sesi Terkoneksi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-xl border transition-all ${
                session.isCurrentSession
                  ? 'border-emerald-300 bg-emerald-50/30 ring-1 ring-emerald-500/20'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    {session.userName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                      {session.userName}
                    </h4>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      {session.userRole}
                    </span>
                  </div>
                </div>

                {session.isCurrentSession ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Sesi Ini
                  </span>
                ) : (
                  <button
                    onClick={() => onTerminateSession(session.id)}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 hover:underline"
                  >
                    <LogOut className="h-3 w-3" /> Putuskan
                  </button>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Laptop className="h-3 w-3" /> Perangkat:
                  </span>
                  <span className="font-medium text-slate-700">{session.os}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Browser:
                  </span>
                  <span className="font-medium text-slate-700">{session.browser}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Lokasi:
                  </span>
                  <span className="font-medium text-slate-700">{session.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Hash className="h-3 w-3" /> IP:
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">{session.ipAddress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Riwayat Login (Login History Table) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-700" />
              Riwayat Autentikasi & Login (Login Audit History)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Catatan riwayat setiap akses masuk baik yang berhasil maupun yang gagal ditolak.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Pengguna / Akun</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Device & OS</th>
                <th className="py-3 px-4">Browser</th>
                <th className="py-3 px-4">Alamat IP</th>
                <th className="py-3 px-4">Lokasi</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loginHistory.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{log.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">@{log.username}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{log.role}</td>
                  <td className="py-3 px-4 text-slate-600">{log.device}</td>
                  <td className="py-3 px-4 text-slate-600">{log.browser}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{log.ipAddress}</td>
                  <td className="py-3 px-4 text-slate-600">{log.location}</td>
                  <td className="py-3 px-4 text-center">
                    {log.status === 'BERHASIL' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> BERHASIL
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertTriangle className="h-3 w-3" /> GAGAL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Policies & Principles */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-700" />
          Kebijakan & Prinsip Keamanan SIMKEU Pesantren
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-emerald-600" /> Penguncian Akun Otomatis
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Akun akan otomatis terkunci jika terjadi 5 kali percobaan login gagal berturut-turut. Hanya Administrator yang dapat membuka kembali.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-600" /> Timeout Sesi Inaktif
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sesi login akan kedaluwarsa secara otomatis setelah 30 menit tidak ada aktivitas pengguna di layar untuk mencegah penyalahgunaan komputer kantor.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-600" /> Perlindungan Audit Permanen
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Akun yang pernah melakukan transaksi keuangan tidak dapat dihapus secara permanen. Akun dinonaktifkan agar rekam jejak audit tetap utuh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
