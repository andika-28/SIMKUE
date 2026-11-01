import React, { useState } from 'react';
import {
  Lock,
  X,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ChangePasswordModalProps {
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  onClose,
  onSuccessToast,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [logoutOtherDevices, setLogoutOtherDevices] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validation
  const hasMin8 = newPassword.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = currentPassword && hasMin8 && hasLetter && hasNumber && isMatch;

  const getStrength = () => {
    let s = 0;
    if (hasMin8) s++;
    if (hasLetter) s++;
    if (hasNumber) s++;
    if (/[^a-zA-Z0-9]/.test(newPassword)) s++;
    return s;
  };
  const strength = getStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setError('Password saat ini wajib diisi.');
      return;
    }
    if (!isFormValid) {
      setError('Kriteria password baru belum terpenuhi atau konfirmasi tidak cocok.');
      return;
    }

    onSuccessToast('Password berhasil diperbarui. Sesi akun telah diamankan.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 text-left my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#064E3B]" />
            <h3 className="text-base font-bold text-[#1E293B]">
              Ubah Password
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

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-[#334155] mb-1">
              Password Saat Ini <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Masukkan password saat ini"
                className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 text-xs text-[#1E293B] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Minimal 8 karakter"
                className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 text-xs text-[#1E293B] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Meter */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] mb-1 font-semibold text-slate-500">
                  <span>Kekuatan Password:</span>
                  <span className={strength <= 1 ? 'text-red-600' : strength <= 3 ? 'text-amber-600' : 'text-emerald-700'}>
                    {strength <= 1 ? 'Lemah' : strength <= 3 ? 'Sedang' : 'Kuat'}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-[#334155] mb-1">
              Konfirmasi Password Baru <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ketik ulang password baru"
                className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 text-xs text-[#1E293B] outline-none"
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

          {/* Terminate other sessions option */}
          <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              checked={logoutOtherDevices}
              onChange={(e) => setLogoutOtherDevices(e.target.checked)}
              className="w-4 h-4 rounded text-[#064E3B] focus:ring-[#064E3B] border-slate-300 cursor-pointer"
            />
            <span className="text-xs text-[#334155] font-semibold">
              Keluar dari perangkat lain untuk keamanan
            </span>
          </label>

          {/* Action Buttons */}
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
              disabled={!isFormValid}
              className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              Simpan Password Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
