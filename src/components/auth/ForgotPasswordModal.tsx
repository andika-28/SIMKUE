import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  User,
  Send,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSubmitRequest: (username: string, notes?: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  onClose,
  onSubmitRequest,
}) => {
  const [username, setUsername] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username wajib diisi.');
      return;
    }

    onSubmitRequest(username.trim(), notes);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 text-left my-8">
        {!isSubmitted ? (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-800">
                <HelpCircle className="w-5 h-5 text-[#064E3B]" />
                <h3 className="text-base font-bold text-[#1E293B]">
                  Butuh Bantuan Login?
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

            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-[#064E3B] leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
              <p>
                Untuk menjaga keamanan sistem keuangan, pengaturan ulang password dilakukan melalui <strong>Administrator</strong>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Username Anda <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Contoh: bendahara1"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 text-xs text-[#1E293B] outline-none"
                  />
                </div>
                {error && (
                  <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: Saya berganti nomor telepon atau lupa password..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 text-xs text-[#1E293B] outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Permintaan Reset</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center py-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 text-[#064E3B] flex items-center justify-center mx-auto mb-3.5">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#1E293B]">
              Permintaan Berhasil Dikirim
            </h3>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              Administrator akan melakukan verifikasi identitas sebelum password akun Anda direset dan diberikan password sementara baru.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pusat Bantuan Darurat:
              </p>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ust. Ahmad Fauzi (Admin IT): 0812-7890-1234</span>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition"
              >
                Tutup & Kembali ke Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
