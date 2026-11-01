import React, { useState } from 'react';
import {
  KeyRound,
  X,
  Copy,
  Check,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  User,
  CheckCircle2,
} from 'lucide-react';
import { AppUser } from '../../types';

interface AdminResetPasswordModalProps {
  user: AppUser | null;
  onClose: () => void;
  onPasswordResetSuccess: (userId: string, newTempPass: string, forceChange: boolean) => void;
}

export const AdminResetPasswordModal: React.FC<AdminResetPasswordModalProps> = ({
  user,
  onClose,
  onPasswordResetSuccess,
}) => {
  const [mode, setMode] = useState<'generate' | 'manual'>('generate');
  const [manualPassword, setManualPassword] = useState('');
  const [forceChangeNextLogin, setForceChangeNextLogin] = useState(true);

  const [generatedPass, setGeneratedPass] = useState(() =>
    generateSecureTempPassword()
  );
  const [isResetDone, setIsResetDone] = useState(false);
  const [copied, setCopied] = useState(false);

  function generateSecureTempPassword() {
    const prefixes = ['RsM', 'Psm', 'Santri', 'Barakah'];
    const randPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const randChar = chars[Math.floor(Math.random() * chars.length)];
    return `${randPrefix}-${randDigits}-${randChar}`;
  }

  const handleRegenerate = () => {
    setGeneratedPass(generateSecureTempPassword());
  };

  const handleCopy = () => {
    const finalPass = mode === 'generate' ? generatedPass : manualPassword;
    navigator.clipboard.writeText(finalPass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePerformReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const finalPass = mode === 'generate' ? generatedPass : manualPassword;
    if (mode === 'manual' && !manualPassword.trim()) return;

    onPasswordResetSuccess(user.id, finalPass, forceChangeNextLogin);
    setIsResetDone(true);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-left my-8">
        {!isResetDone ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#064E3B]" />
                <h3 className="text-base font-bold text-[#1E293B]">
                  Reset Password Pengguna
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target User Info */}
            <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${user.avatarColor} flex items-center justify-center font-bold text-xs shadow-xs`}>
                {user.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#1E293B] truncate">{user.name}</p>
                <p className="text-[10px] text-[#64748B]">
                  Username: <strong className="text-slate-700">{user.username}</strong> • {user.role}
                </p>
              </div>
            </div>

            <form onSubmit={handlePerformReset} className="mt-4 space-y-4">
              {/* Option Selector */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-2">
                  Metode Pembuatan Password:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('generate')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center gap-2 ${
                      mode === 'generate'
                        ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Generate Otomatis</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center gap-2 ${
                      mode === 'manual'
                        ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Set Manual</span>
                  </button>
                </div>
              </div>

              {/* Mode-specific Fields */}
              {mode === 'generate' ? (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                    <span>Password Sementara Otomatis:</span>
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-bold"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Acak Ulang
                    </button>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono font-bold text-emerald-800 text-sm tracking-wider text-center select-all">
                    {generatedPass}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Masukkan Password Baru
                  </label>
                  <input
                    type="text"
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    placeholder="Minimal 8 karakter..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#064E3B] outline-none"
                  />
                </div>
              )}

              {/* Force password change checkbox */}
              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <input
                  type="checkbox"
                  checked={forceChangeNextLogin}
                  onChange={(e) => setForceChangeNextLogin(e.target.checked)}
                  className="w-4 h-4 rounded text-[#064E3B] focus:ring-[#064E3B] border-slate-300 cursor-pointer"
                />
                <span className="text-xs text-[#064E3B] font-semibold">
                  Wajib ganti password saat login berikutnya
                </span>
              </label>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={mode === 'manual' && manualPassword.length < 6}
                  className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Reset Success State */
          <div className="text-center py-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 text-[#064E3B] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#1E293B]">
              Password Berhasil Direset
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Password sementara untuk <strong>{user.name}</strong> telah dibuat.
            </p>

            {/* Password Token Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 mb-1">
                Password Sementara:
              </p>
              <div className="font-mono text-lg font-black tracking-widest text-white select-all">
                {mode === 'generate' ? generatedPass : manualPassword}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Password'}</span>
              </button>
            </div>

            {/* Warning Note */}
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Catatan Keamanan:</strong> Password sementara ini hanya ditampilkan sekali. Pastikan password diberikan langsung kepada pengguna yang bersangkutan.
              </p>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition"
              >
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
