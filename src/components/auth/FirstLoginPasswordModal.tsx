import React, { useState } from 'react';
import {
  ShieldAlert,
  KeyRound,
  Check,
  X,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CurrentAuthUser } from '../../types';

interface FirstLoginPasswordModalProps {
  user: CurrentAuthUser;
  onPasswordUpdated: (updatedUser: CurrentAuthUser) => void;
  onCancelToLogin: () => void;
}

export const FirstLoginPasswordModal: React.FC<FirstLoginPasswordModalProps> = ({
  user,
  onPasswordUpdated,
  onCancelToLogin,
}) => {
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showTemp, setShowTemp] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live Password Validation rules
  const hasMin8Chars = newPassword.length >= 8;
  const hasLetters = /[a-zA-Z]/.test(newPassword);
  const hasNumbers = /\d/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isAllValid = hasMin8Chars && hasLetters && hasNumbers && isMatch;

  // Strength score
  const getStrength = () => {
    let score = 0;
    if (hasMin8Chars) score++;
    if (hasLetters) score++;
    if (hasNumbers) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  };

  const strength = getStrength();

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!tempPassword) {
      setErrorMessage('Password sementara wajib diisi.');
      return;
    }

    if (!isAllValid) {
      setErrorMessage('Pastikan semua kriteria password baru terpenuhi dan konfirmasi sesuai.');
      return;
    }

    // Success simulation
    setIsSuccess(true);
  };

  const handleProceedToDashboard = () => {
    const updated: CurrentAuthUser = {
      ...user,
      isFirstLogin: false,
    };
    onPasswordUpdated(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 text-left my-8">
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#064E3B] border border-emerald-200 flex items-center justify-center shrink-0">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 mb-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Aktivasi Akun Pertama
                </div>
                <h3 className="text-xl font-black text-[#1E293B] tracking-tight">
                  Selamat Datang di SIMKEU
                </h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Sebelum menggunakan sistem, silakan perbarui password Anda untuk keamanan akun.
                </p>
              </div>
            </div>

            {/* User Details Pill */}
            <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-[#1E293B]">{user.name}</p>
                <p className="text-[10px] text-[#64748B]">{user.username} • {user.role}</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Wajib Ganti Password
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSavePassword} className="mt-5 space-y-4">
              {/* Password Sementara */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Password Sementara <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showTemp ? 'text' : 'password'}
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="Masukkan password yang diberikan Admin"
                    className="w-full pl-3.5 pr-10 py-2 bg-white rounded-xl border border-[#E2E8F0] focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 text-xs text-[#1E293B] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTemp(!showTemp)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showTemp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Buat password baru yang kuat"
                    className="w-full pl-3.5 pr-10 py-2 bg-white rounded-xl border border-[#E2E8F0] focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 text-xs text-[#1E293B] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength Meter Bar */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] mb-1 font-semibold text-slate-500">
                      <span>Kekuatan Password:</span>
                      <span className={strength <= 1 ? 'text-red-600' : strength <= 3 ? 'text-amber-600' : 'text-emerald-700'}>
                        {strength <= 1 ? 'Lemah' : strength <= 3 ? 'Sedang' : 'Kuat & Aman'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${strength >= 1 ? (strength === 1 ? 'bg-red-500' : 'bg-amber-500') : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 rounded-full ${strength >= 2 ? (strength <= 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 rounded-full ${strength >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 rounded-full ${strength >= 4 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Konfirmasi Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password baru"
                    className="w-full pl-3.5 pr-10 py-2 bg-white rounded-xl border border-[#E2E8F0] focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 text-xs text-[#1E293B] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Live Checklist */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Kriteria Keamanan Password:
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasMin8Chars ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {hasMin8Chars ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                  </div>
                  <span className={hasMin8Chars ? 'text-emerald-900 font-semibold' : 'text-slate-500'}>
                    Minimal 8 karakter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasLetters ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {hasLetters ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                  </div>
                  <span className={hasLetters ? 'text-emerald-900 font-semibold' : 'text-slate-500'}>
                    Mengandung huruf
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasNumbers ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {hasNumbers ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                  </div>
                  <span className={hasNumbers ? 'text-emerald-900 font-semibold' : 'text-slate-500'}>
                    Mengandung angka
                  </span>
                </div>
                {confirmPassword && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isMatch ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'}`}>
                      {isMatch ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                    </div>
                    <span className={isMatch ? 'text-emerald-900 font-semibold' : 'text-red-600'}>
                      Konfirmasi password cocok
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onCancelToLogin}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                >
                  Batal ke Login
                </button>
                <button
                  type="submit"
                  disabled={!isAllValid || !tempPassword}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-emerald-950/10"
                >
                  <span>Simpan Password Baru</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 text-[#064E3B] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-[#1E293B]">
              Password Berhasil Diperbarui
            </h3>
            <p className="text-xs text-[#64748B] mt-2 max-w-xs mx-auto leading-relaxed">
              Akun Anda telah diamankan dan siap digunakan untuk mengelola keuangan pesantren.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleProceedToDashboard}
                className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>Lanjut ke Dashboard</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
