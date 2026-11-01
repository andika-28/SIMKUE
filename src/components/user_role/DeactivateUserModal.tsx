import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  UserX,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { AppUser } from '../../types';

interface DeactivateUserModalProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeactivate: (userId: string, reason: string) => void;
}

export const DeactivateUserModal: React.FC<DeactivateUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirmDeactivate,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const isDeactivating = user.status === 'Aktif';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeactivating && !reason.trim()) {
      setError('Alasan penonaktifan akun wajib dicatat untuk audit internal');
      return;
    }
    onConfirmDeactivate(user.id, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${
          isDeactivating ? 'bg-rose-50/50 border-rose-100' : 'bg-emerald-50/50 border-emerald-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDeactivating ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isDeactivating ? <UserX className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {isDeactivating ? 'Nonaktifkan Akun Pengguna?' : 'Aktifkan Kembali Pengguna?'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isDeactivating ? 'Penonaktifan akses login tanpa menghapus riwayat' : 'Pemulihan akses login ke SIMKEU'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Profile Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${user.avatarColor} flex items-center justify-center text-sm font-bold shrink-0`}>
              {user.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-800">{user.name}</h4>
              <p className="text-[11px] text-slate-500">
                @{user.username} • Role: {user.role} ({user.title})
              </p>
            </div>
          </div>

          {/* Principle explanation banner */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1.5 text-amber-900">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="h-4 w-4 text-amber-700" />
              Prinsip Audit Integritas Keuangan:
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Akun pengguna yang dinonaktifkan tidak akan dapat masuk ke sistem. Seluruh data transaksi pemasukan, pengeluaran, nota, dan audit log yang pernah dibuat oleh akun ini <strong>tetap tersimpan secara permanen</strong> dengan label identitas pengguna untuk menjaga akuntabilitas audit.
            </p>
          </div>

          {/* Reason Input */}
          {isDeactivating && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Alasan Penonaktifan <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                rows={3}
                placeholder="Contoh: Telah selesai masa tugas / rotasi jabatan sesuai SK Pimpinan No. ..."
                className={`w-full p-3 text-xs border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors ${
                  error ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {error && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {error}
                </p>
              )}
            </div>
          )}

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
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5 ${
                isDeactivating
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              {isDeactivating ? <UserX className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              {isDeactivating ? 'Konfirmasi Nonaktifkan' : 'Konfirmasi Aktifkan Akun'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
