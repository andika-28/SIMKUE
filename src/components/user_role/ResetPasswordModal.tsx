import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Sparkles,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { AppUser } from '../../types';

interface ResetPasswordModalProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (userId: string, newPass: string, forceChange: boolean) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [resetMethod, setResetMethod] = useState<'auto' | 'manual'>('auto');
  const [manualPassword, setManualPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forceChangeNextLogin, setForceChangeNextLogin] = useState(true);
  const [generatedPass, setGeneratedPass] = useState('Santri@Mahato2026!');

  if (!isOpen || !user) return null;

  const handleGenerateNew = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(res);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPass = resetMethod === 'auto' ? generatedPass : manualPassword;
    if (resetMethod === 'manual' && manualPassword.length < 8) {
      alert('Password manual minimal 8 karakter');
      return;
    }
    onConfirmReset(user.id, finalPass, forceChangeNextLogin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-600" />
              Reset Password Pengguna
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur ulang kata sandi login untuk pengguna akun ini.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target User Info */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${user.avatarColor} flex items-center justify-center text-sm font-bold shrink-0`}>
              {user.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-800">{user.name}</h4>
              <p className="text-[11px] text-slate-500 font-mono">
                Username: @{user.username} • Role: {user.role}
              </p>
            </div>
          </div>

          {/* Reset Method Option */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Metode Reset Password</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer text-xs font-medium transition-all ${
                  resetMethod === 'auto'
                    ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 font-bold ring-1 ring-emerald-600/30'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="resetMethod"
                  checked={resetMethod === 'auto'}
                  onChange={() => setResetMethod('auto')}
                  className="text-emerald-600"
                />
                Generate Password Sementara
              </label>

              <label
                className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer text-xs font-medium transition-all ${
                  resetMethod === 'manual'
                    ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 font-bold ring-1 ring-emerald-600/30'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="resetMethod"
                  checked={resetMethod === 'manual'}
                  onChange={() => setResetMethod('manual')}
                  className="text-emerald-600"
                />
                Ketik Password Baru Manual
              </label>
            </div>
          </div>

          {/* Conditional Input */}
          {resetMethod === 'auto' ? (
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">Password Sementara:</span>
                <button
                  type="button"
                  onClick={handleGenerateNew}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Buat Ulang
                </button>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-amber-300 font-mono text-sm font-bold text-slate-800 text-center tracking-wider selection:bg-amber-100">
                {generatedPass}
              </div>
              <p className="text-[11px] text-amber-700">
                Berikan password sementara ini kepada pengguna secara aman.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={manualPassword}
                  onChange={(e) => setManualPassword(e.target.value)}
                  placeholder="Masukkan minimal 8 karakter"
                  className="w-full pl-3.5 pr-10 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Checkbox Force Password Change */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={forceChangeNextLogin}
                onChange={(e) => setForceChangeNextLogin(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Wajibkan pengguna mengubah password saat login berikutnya
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Sistem akan meminta pengguna mengganti password baru sebelum dapat mengakses menu keuangan.
                </span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <KeyRound className="h-4 w-4" />
              Reset Password Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
