import React, { useState, useEffect } from 'react';
import {
  UserX,
  ShieldAlert,
  Lock,
  ArrowLeft,
  Clock,
  PhoneCall,
  Mail,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { CurrentAuthUser } from '../../types';

interface AccountStatusScreenProps {
  user: CurrentAuthUser;
  onReturnToLogin: () => void;
}

export const AccountStatusScreen: React.FC<AccountStatusScreenProps> = ({
  user,
  onReturnToLogin,
}) => {
  // Real countdown timer for locked account (default 30 mins)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    if (user.lockUntil) {
      const diff = Math.max(0, Math.floor((user.lockUntil - Date.now()) / 1000));
      return diff > 0 ? diff : 29 * 60 + 45; // 29:45 fallback
    }
    return 29 * 60 + 45;
  });

  useEffect(() => {
    if (user.status !== 'Terkunci') return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [user.status]);

  const formatCountdown = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
        {/* Top Icon depending on status */}
        {user.status === 'Nonaktif' ? (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-4">
            <UserX className="w-8 h-8" />
          </div>
        ) : user.status === 'Ditangguhkan' ? (
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-red-100 border border-red-200 text-red-700 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-black text-[#1E293B] tracking-tight">
          {user.status === 'Nonaktif'
            ? 'Akun Tidak Aktif'
            : user.status === 'Ditangguhkan'
            ? 'Akun Ditangguhkan'
            : 'Akun Terkunci Sementara'}
        </h3>

        {/* User Card */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs inline-flex items-center gap-2 max-w-xs mx-auto">
          <span className="font-bold text-slate-700">{user.name}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 font-mono text-[11px]">{user.username}</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              user.status === 'Nonaktif'
                ? 'bg-slate-200 text-slate-700'
                : user.status === 'Ditangguhkan'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {user.status}
          </span>
        </div>

        {/* Message */}
        <div className="mt-4 text-xs text-[#64748B] leading-relaxed space-y-2">
          {user.status === 'Nonaktif' && (
            <>
              <p className="font-semibold text-slate-700">
                Akun Anda saat ini tidak dapat digunakan untuk mengakses sistem.
              </p>
              <p>
                Status akun dinonaktifkan oleh Administrator. Silakan hubungi Administrator untuk informasi lebih lanjut.
              </p>
            </>
          )}

          {user.status === 'Ditangguhkan' && (
            <>
              <p className="font-semibold text-slate-700">
                Akses akun Anda telah ditangguhkan sementara.
              </p>
              <p>
                Hubungi Administrator Sistem untuk verifikasi otoritas dan pembukaan kembali izin akses.
              </p>
            </>
          )}

          {user.status === 'Terkunci' && (
            <>
              <p className="font-semibold text-red-700">
                Terlalu banyak percobaan login yang gagal.
              </p>
              <p>
                Untuk perlindungan keamanan data keuangan pesantren, sistem mengunci akun selama 30 menit. Silakan tunggu sebelum mencoba kembali atau hubungi Administrator.
              </p>

              {/* Countdown Display */}
              <div className="my-4 p-4 rounded-xl bg-red-50 border border-red-200 inline-block w-full">
                <div className="flex items-center justify-center gap-1.5 text-red-800 text-[11px] font-bold">
                  <Clock className="w-4 h-4 animate-spin text-red-600" />
                  <span>Coba kembali dalam:</span>
                </div>
                <div className="text-3xl font-black font-mono text-red-700 mt-1 tracking-wider">
                  {formatCountdown(secondsRemaining)}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Admin Contact Help Box */}
        <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Kontak Bantuan IT Pesantren:
          </p>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <span>0812-7890-1234 (Ust. Ahmad Fauzi - IT)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Mail className="w-3.5 h-3.5 text-emerald-700" />
            <span>admin@raudhatussalam-mahato.sch.id</span>
          </div>
        </div>

        {/* Return to Login Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onReturnToLogin}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
