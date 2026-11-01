import React from 'react';
import {
  X,
  Tag,
  Calendar,
  Layers,
  Users,
  CheckCircle2,
  Clock,
  Ban,
  FileSpreadsheet,
  AlertTriangle,
  FileText,
  UserCheck,
  Edit,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { BillingDiscount, DiscountStatus } from '../../types';

interface DiscountDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  discount: BillingDiscount | null;
  onEditDiscount: (discount: BillingDiscount) => void;
  onToggleStatus: (discount: BillingDiscount, status: DiscountStatus) => void;
  onOpenAdjustmentModal: (discount: BillingDiscount) => void;
}

export const DiscountDetailDrawer: React.FC<DiscountDetailDrawerProps> = ({
  isOpen,
  onClose,
  discount,
  onEditDiscount,
  onToggleStatus,
  onOpenAdjustmentModal,
}) => {
  if (!isOpen || !discount) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const getStatusBadge = (status: DiscountStatus) => {
    switch (status) {
      case 'AKTIF':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            AKTIF
          </span>
        );
      case 'SUDAH DITERAPKAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            SUDAH DITERAPKAN
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            DRAFT
          </span>
        );
      case 'DIBATALKAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-800 border border-rose-200">
            <Ban className="w-3.5 h-3.5 text-rose-600" />
            DIBATALKAN
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="discount-detail-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200 shadow-2xs">
                <Tag className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Detail Diskon Tagihan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ID: #{discount.id} • {discount.periode}
                </p>
              </div>
            </div>
            <button
              type="button"
              id="btn-close-discount-drawer"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {/* Status & Title Card */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status Diskon
                </span>
                {getStatusBadge(discount.status)}
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {discount.namaDiskon}
              </h4>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700">
                  {discount.jenisTagihan}
                </span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700">
                  {discount.tahunAjaran}
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg font-bold text-[#064E3B]">
                  Target: {discount.targetDetail}
                </span>
              </div>
            </div>

            {/* Financial Calculation Simulation Card */}
            <div className="bg-emerald-950 text-white p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Rincian Potongan Tagihan
                </span>
                <span className="text-[11px] font-semibold text-emerald-200 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/60">
                  {discount.tipeDiskon}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-emerald-200">
                  <span>Nominal Normal Tagihan:</span>
                  <span className="font-semibold text-white">
                    {formatRupiah(discount.nominalNormal)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-emerald-300 font-bold">
                  <span>Potongan Diskon:</span>
                  <span className="text-emerald-300">
                    - {formatRupiah(discount.nominalDiskon)}
                    {discount.persentaseDiskon && ` (${discount.persentaseDiskon}%)`}
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-800/80 flex justify-between items-center">
                  <span className="font-bold text-white">Tagihan Akhir per Santri:</span>
                  <span className="text-base font-extrabold text-emerald-400">
                    {formatRupiah(discount.nominalAkhir)}
                  </span>
                </div>
              </div>

              {/* Total Impact */}
              <div className="pt-3 border-t border-emerald-800/80 bg-emerald-900/40 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-emerald-300 font-medium">
                    Estimasi Total Diskon ({discount.santriTerdampakCount} Santri)
                  </div>
                  <div className="text-lg font-extrabold text-white">
                    {formatRupiah(discount.estimasiTotalDiskon)}
                  </div>
                </div>
                <div className="text-right text-[11px] text-emerald-200">
                  <Users className="w-4 h-4 ml-auto text-emerald-400 mb-0.5" />
                  <span>{discount.santriTerdampakCount} Santri</span>
                </div>
              </div>
            </div>

            {/* Target Breakdown Detail */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Cakupan Target Penerima Diskon
              </span>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Kategori Scope:</span>
                  <span className="font-bold text-slate-800">
                    {discount.targetDiskon}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Rincian Sasaran:</span>
                  <span className="font-bold text-slate-800">
                    {discount.targetDetail}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Jumlah Penerima:</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {discount.santriTerdampakCount} Santri
                  </span>
                </div>
              </div>
            </div>

            {/* Alasan & Catatan Audit */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Alasan & Dokumen Pendukung
              </span>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="text-slate-500 font-medium">Alasan Resmi:</div>
                <div className="font-semibold text-slate-800 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                  {discount.alasan}
                </div>

                {discount.catatanInternal && (
                  <>
                    <div className="text-slate-500 font-medium pt-1">
                      Catatan Internal & Verifikasi:
                    </div>
                    <div className="text-slate-600 italic bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                      {discount.catatanInternal}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Warning State if Billing Already Generated */}
            {discount.isBillingGenerated ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-amber-900">
                      Tagihan Periode Ini Telah Diterbitkan
                    </h5>
                    <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                      Tagihan bulanan santri untuk {discount.periode} sudah diterbitkan.
                      Perubahan nominal tidak dapat dilakukan secara langsung agar integritas
                      data mutasi bendahara tetap terjaga.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-drawer-make-adjustment"
                  onClick={() => onOpenAdjustmentModal(discount)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Buat Penyesuaian Tagihan</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>
                  Diskon ini siap diterapkan pada batch generate tagihan {discount.periode}.
                </span>
              </div>
            )}

            {/* Audit Logs Metadata */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex justify-between">
                <span>Dibuat Oleh:</span>
                <span className="font-semibold text-slate-700">
                  {discount.dibuatOleh} ({discount.tanggalDibuat})
                </span>
              </div>
              {discount.terakhirDiubahOleh && (
                <div className="flex justify-between">
                  <span>Terakhir Diubah:</span>
                  <span className="font-semibold text-slate-700">
                    {discount.terakhirDiubahOleh} ({discount.tanggalDiubah})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-[#E2E8F0] bg-slate-50 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="btn-close-drawer-bottom"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Tutup
            </button>

            {!discount.isBillingGenerated && (
              <>
                {discount.status === 'AKTIF' && (
                  <button
                    type="button"
                    id="btn-cancel-discount-drawer"
                    onClick={() => {
                      onToggleStatus(discount, 'DIBATALKAN');
                      onClose();
                    }}
                    className="px-3.5 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
                  >
                    Batalkan Diskon
                  </button>
                )}

                {discount.status === 'DRAFT' && (
                  <button
                    type="button"
                    id="btn-activate-discount-drawer"
                    onClick={() => {
                      onToggleStatus(discount, 'AKTIF');
                      onClose();
                    }}
                    className="px-3.5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-colors"
                  >
                    Aktifkan Diskon
                  </button>
                )}

                <button
                  type="button"
                  id="btn-edit-discount-drawer"
                  onClick={() => {
                    onEditDiscount(discount);
                    onClose();
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#047857] rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Diskon</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
