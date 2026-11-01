import React from 'react';
import {
  X,
  User,
  Building2,
  FileText,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  ExternalLink,
  Phone,
  Layers,
  Sparkles,
  Receipt,
} from 'lucide-react';
import { YearlyBillRow } from '../../types';

interface YearlyBillDetailDrawerProps {
  isOpen: boolean;
  bill: YearlyBillRow | null;
  onClose: () => void;
  onNavigateToStudentDetail: (nis: string) => void;
  onPrintReceipt: (bill: YearlyBillRow) => void;
}

export const YearlyBillDetailDrawer: React.FC<YearlyBillDetailDrawerProps> = ({
  isOpen,
  bill,
  onClose,
  onNavigateToStudentDetail,
  onPrintReceipt,
}) => {
  if (!isOpen || !bill) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const progressPct = bill.persentaseBayar;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="drawer-yearly-bill-detail"
          className="w-screen max-w-md md:max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E2E8F0] bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200 shadow-2xs">
                <Receipt className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
                  Detail Tagihan Tahunan
                </h3>
                <p className="text-xs text-[#64748B]">
                  Tahun Ajaran {bill.tahunAjaran}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-drawer-yearly"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. Student Info Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-[#0F172A]">
                    {bill.namaSantri}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-mono">
                    <span className="font-bold">NIS: {bill.nis}</span>
                    <span>•</span>
                    <span>{bill.unit}</span>
                    <span>•</span>
                    <span>{bill.kelas}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                    bill.statusSantri === 'Santri Baru'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {bill.statusSantri}
                </span>
              </div>

              {bill.namaWali && (
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                  <span className="text-slate-500">Wali Santri:</span>
                  <span className="font-semibold text-slate-800">{bill.namaWali}</span>
                </div>
              )}

              {bill.noHpWali && (
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Kontak:
                  </span>
                  <span className="font-mono text-slate-700">{bill.noHpWali}</span>
                </div>
              )}
            </div>

            {/* 2. Large Payment Progress Bar */}
            <div className="p-4 bg-emerald-50/40 border border-emerald-200/70 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950 uppercase tracking-wider text-[11px]">
                  Payment Progress
                </span>
                <span className="font-black text-emerald-800 text-sm">
                  {progressPct}%
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressPct === 100
                      ? 'bg-emerald-600'
                      : progressPct > 0
                      ? 'bg-emerald-500'
                      : 'bg-slate-300'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <span>Terbayar: {formatRupiah(bill.sudahDibayar)}</span>
                <span className="font-semibold text-slate-800">
                  Total: {formatRupiah(bill.totalTagihan)}
                </span>
              </div>
            </div>

            {/* 3. Itemized Fee Breakdown Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#064E3B]" />
                  <span>Rincian Tagihan</span>
                </h4>
                <span className="text-xs font-medium text-slate-400">
                  3 Komponen Biaya
                </span>
              </div>

              {/* Item 1: Uang Pembangunan */}
              <div className="p-4 border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 flex-shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">
                        UANG PEMBANGUNAN
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        {bill.statusSantri}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">
                      {formatRupiah(bill.uangPembangunan)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Status:</span>
                  <span
                    className={`font-bold ${
                      bill.pembangunanStatus === 'LUNAS'
                        ? 'text-emerald-700'
                        : bill.pembangunanStatus === 'SEBAGIAN'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {bill.pembangunanStatus === 'LUNAS'
                      ? '✓ Lunas Terbayar'
                      : bill.pembangunanStatus === 'SEBAGIAN'
                      ? `Sebagian Dibayar (${formatRupiah(bill.pembangunanTerbayar)})`
                      : 'Belum Dibayar'}
                  </span>
                </div>
              </div>

              {/* Item 2: Uang Kertas */}
              <div className="p-4 border border-slate-200 rounded-xl space-y-2.5 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">
                        UANG KERTAS
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Rp 500.000 / Tahun
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">
                      {formatRupiah(bill.uangKertas)}
                    </span>
                  </div>
                </div>

                {/* Sub-breakdown per semester */}
                <div className="bg-slate-50 p-2.5 rounded-lg space-y-1.5 text-xs border border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Semester Ganjil:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {formatRupiah(bill.uangKertasGanjil.nominal)}
                      </span>
                      {bill.uangKertasGanjil.lunas ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                          ✓ Lunas
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                          Belum Dibayar
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Semester Genap:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {formatRupiah(bill.uangKertasGenap.nominal)}
                      </span>
                      {bill.uangKertasGenap.lunas ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                          ✓ Lunas
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                          Belum Dibayar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 3: Uang Kegiatan */}
              <div className="p-4 border border-slate-200 rounded-xl space-y-2.5 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 flex-shrink-0">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">
                        UANG KEGIATAN
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Rp 400.000 / Tahun
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">
                      {formatRupiah(bill.uangKegiatan)}
                    </span>
                  </div>
                </div>

                {/* Sub-breakdown per semester */}
                <div className="bg-slate-50 p-2.5 rounded-lg space-y-1.5 text-xs border border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Semester Ganjil:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {formatRupiah(bill.uangKegiatanGanjil.nominal)}
                      </span>
                      {bill.uangKegiatanGanjil.lunas ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                          ✓ Lunas
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                          Belum Dibayar
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Semester Genap:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {formatRupiah(bill.uangKegiatanGenap.nominal)}
                      </span>
                      {bill.uangKegiatanGenap.lunas ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                          ✓ Lunas
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                          Belum Dibayar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Financial Summary Total Box */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>TOTAL TAGIHAN:</span>
                <span className="font-bold text-white">
                  {formatRupiah(bill.totalTagihan)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-400">
                <span>TOTAL DIBAYAR:</span>
                <span className="font-bold">
                  {formatRupiah(bill.sudahDibayar)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm">
                <span className="font-extrabold text-amber-400">
                  SISA TAGIHAN:
                </span>
                <span className="font-black text-amber-400 text-base">
                  {formatRupiah(bill.sisaTagihan)}
                </span>
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-5 border-t border-[#E2E8F0] bg-slate-50 flex flex-col gap-2.5">
            <button
              type="button"
              id="btn-drawer-print-receipt"
              onClick={() => onPrintReceipt(bill)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak Rincian Tagihan</span>
            </button>

            <button
              type="button"
              id="btn-drawer-to-student-detail"
              onClick={() => {
                onClose();
                onNavigateToStudentDetail(bill.nis);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <span>Lihat Detail Keuangan Santri</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
