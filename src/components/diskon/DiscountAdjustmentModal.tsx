import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react';
import { BillingDiscount, DiscountAdjustmentHistory } from '../../types';

interface DiscountAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  discount: BillingDiscount | null;
  onSaveAdjustment: (adjustment: Omit<DiscountAdjustmentHistory, 'id'>) => void;
}

export const DiscountAdjustmentModal: React.FC<DiscountAdjustmentModalProps> = ({
  isOpen,
  onClose,
  discount,
  onSaveAdjustment,
}) => {
  const [diskonBaru, setDiskonBaru] = useState<number>(0);
  const [alasan, setAlasan] = useState('');
  const [keteranganTambahan, setKeteranganTambahan] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (discount) {
      setDiskonBaru(discount.nominalDiskon);
      setAlasan('Penyesuaian jumlah hari aktif libur santri.');
      setKeteranganTambahan('Disetujui pimpinan dan bendahara pengasuhan.');
      setError(null);
    }
  }, [discount, isOpen]);

  if (!isOpen || !discount) return null;

  const diskonSebelumnya = discount.nominalDiskon;
  const perubahan = diskonBaru - diskonSebelumnya;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alasan.trim()) {
      setError('Alasan penyesuaian wajib diisi.');
      return;
    }
    if (diskonBaru < 0) {
      setError('Nominal diskon baru tidak boleh negatif.');
      return;
    }
    if (diskonBaru > discount.nominalNormal) {
      setError(
        `Nominal diskon baru tidak boleh melebihi tarif normal (${formatRupiah(discount.nominalNormal)}).`
      );
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')} Agu 2026`;

    onSaveAdjustment({
      discountId: discount.id,
      tanggal: formattedDate,
      periode: discount.periode,
      jenisTagihan: discount.jenisTagihan,
      diskonSebelumnya,
      diskonBaru,
      perubahan,
      alasan: alasan.trim(),
      dibuatOleh: 'Administrator',
      keteranganTambahan: keteranganTambahan.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="modal-discount-adjustment"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-amber-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Buat Penyesuaian Tagihan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit Trail Penyesuaian Periode {discount.periode}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Information banner */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-amber-900 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Pemberitahuan Audit:</strong> Tagihan untuk periode ini sudah diterbitkan. Perubahan diskon akan dicatat sebagai riwayat penyesuaian resmi tanpa menghapus jejak histori transaksi.
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold">
              {error}
            </div>
          )}

          {/* Target and Period recap */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Nama Diskon:</span>
              <span className="font-bold text-slate-800">{discount.namaDiskon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Jenis Tagihan:</span>
              <span className="font-bold text-slate-800">{discount.jenisTagihan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Target Sasaran:</span>
              <span className="font-bold text-slate-800">
                {discount.targetDetail} ({discount.santriTerdampakCount} Santri)
              </span>
            </div>
          </div>

          {/* Nominal Before vs After */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">
                Diskon Sebelumnya
              </label>
              <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 font-bold text-slate-700">
                {formatRupiah(diskonSebelumnya)}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Diskon Baru (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={diskonBaru}
                onChange={(e) => setDiskonBaru(Number(e.target.value))}
                min="0"
                step="5000"
                className="w-full font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          {/* Calculated Delta */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <span className="font-semibold text-emerald-900">Perubahan Diskon:</span>
            <div className="flex items-center gap-1 font-extrabold text-emerald-800 text-sm">
              {perubahan >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>+ {formatRupiah(perubahan)}</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  <span className="text-rose-700">- {formatRupiah(Math.abs(perubahan))}</span>
                </>
              )}
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Alasan Penyesuaian <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Contoh: Penyesuaian jumlah hari aktif libur akhir bulan dari 5 menjadi 7 hari..."
              className="w-full text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-600 font-medium"
            />
          </div>

          {/* Internal notes */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Keterangan Tambahan Audit
            </label>
            <input
              type="text"
              value={keteranganTambahan}
              onChange={(e) => setKeteranganTambahan(e.target.value)}
              placeholder="Nomor berita acara / lampiran keputusan..."
              className="w-full text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-600"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Simpan Penyesuaian</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
