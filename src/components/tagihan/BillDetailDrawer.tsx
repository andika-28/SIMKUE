import React from 'react';
import {
  X,
  User,
  Calendar,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Printer,
  ExternalLink,
  Phone,
  Tag,
  CreditCard,
  Building,
  Utensils,
  Clock,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { MonthlyBillRow } from '../../types';
import { MEAL_PACKAGES_INFO } from '../../data/studentsData';

interface BillDetailDrawerProps {
  bill: MonthlyBillRow | null;
  isOpen: boolean;
  onClose: () => void;
  onViewStudentDetail: (nis: string) => void;
  onPrintBill: (bill: MonthlyBillRow) => void;
  onMarkStatusToggle?: (bill: MonthlyBillRow) => void;
}

export const BillDetailDrawer: React.FC<BillDetailDrawerProps> = ({
  bill,
  isOpen,
  onClose,
  onViewStudentDetail,
  onPrintBill,
  onMarkStatusToggle,
}) => {
  if (!isOpen || !bill) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const mealInfo = MEAL_PACKAGES_INFO[bill.paketMakan] || {
    label: bill.paketMakan,
    priceFormatted: formatRupiah(bill.uangMakan),
  };

  const isLunas = bill.status === 'LUNAS';
  const subtotal = bill.spp + bill.uangMakan + bill.listrikAir;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="bill-detail-drawer"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform ease-in-out duration-300 animate-in slide-in-from-right"
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
                <Receipt className="w-4 h-4 text-[#064E3B]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Detail Tagihan Santri</h3>
                <p className="text-xs text-[#64748B]">Periode {bill.periode}</p>
              </div>
            </div>
            <button
              type="button"
              id="btn-close-bill-drawer"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Student Information Card */}
            <div className="bg-slate-50/80 rounded-xl p-4 border border-[#E2E8F0]">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                  {bill.namaSantri
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-[#0F172A] truncate">
                      {bill.namaSantri}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700">
                      {bill.unit}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] font-mono mt-0.5">NIS: {bill.nis}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-[#064E3B] border border-emerald-200">
                      {bill.kelas}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-amber-700" />
                      {bill.paketMakan}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guardian quick info */}
              {bill.namaWali && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-[#64748B]">
                  <span>Wali: <strong className="text-slate-700">{bill.namaWali}</strong></span>
                  {bill.noHpWali && (
                    <a
                      href={`https://wa.me/${bill.noHpWali.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-medium hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Phone className="w-3 h-3" />
                      {bill.noHpWali}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Status Indicator Card */}
            <div
              className={`rounded-xl p-4 border flex items-center justify-between ${
                isLunas
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-rose-50/70 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
                    isLunas
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {isLunas ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Status Tagihan
                  </span>
                  <p
                    className={`text-sm font-bold ${
                      isLunas ? 'text-emerald-900' : 'text-rose-900'
                    }`}
                  >
                    {isLunas ? '✓ LUNAS' : '● BELUM LUNAS'}
                  </p>
                </div>
              </div>

              {onMarkStatusToggle && (
                <button
                  type="button"
                  onClick={() => onMarkStatusToggle(bill)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                    isLunas
                      ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                  }`}
                >
                  {isLunas ? 'Ubah Status' : 'Tandai Lunas'}
                </button>
              )}
            </div>

            {/* Rincian Tagihan Breakdown */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Rincian Tagihan
                </h4>
                <span className="text-xs font-medium text-slate-500">
                  Jatuh Tempo: {bill.jatuhTempo || '10 Agustus 2026'}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Item 1: SPP */}
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                    <span className="text-slate-700 font-medium">SPP Bulanan</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatRupiah(bill.spp)}
                  </span>
                </div>

                {/* Item 2: Uang Makan */}
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-slate-700 font-medium">Uang Makan ({bill.paketMakan})</span>
                    </div>
                    <p className="text-[10px] text-slate-400 ml-4">{mealInfo.label}</p>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatRupiah(bill.uangMakan)}
                  </span>
                </div>

                {/* Item 3: Listrik & Air */}
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-slate-700 font-medium">Listrik & Air Asrama</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatRupiah(bill.listrikAir)}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between pt-1 text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-medium font-mono">{formatRupiah(subtotal)}</span>
                </div>

                {/* Discount (if any) */}
                <div className="flex items-center justify-between text-emerald-700 font-medium">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Diskon / Potongan:</span>
                  </div>
                  <span className="font-mono">
                    {bill.diskon > 0 ? `-${formatRupiah(bill.diskon)}` : 'Rp0'}
                  </span>
                </div>

                {bill.diskonKeterangan && (
                  <p className="text-[10px] bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-100">
                    ℹ️ {bill.diskonKeterangan}
                  </p>
                )}

                {/* TOTAL TAGIHAN */}
                <div className="mt-3 pt-3 border-t-2 border-slate-200 flex items-center justify-between text-sm">
                  <span className="font-bold text-[#0F172A] uppercase">Total Tagihan:</span>
                  <span className="font-extrabold text-[#064E3B] text-lg font-mono">
                    {formatRupiah(bill.totalTagihan)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                Informasi Pembayaran
              </h4>

              {isLunas ? (
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Tanggal Pembayaran:</span>
                    <span className="font-bold text-slate-800">{bill.tanggalPembayaran || '31 Agustus 2026'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">No. Referensi:</span>
                    <span className="font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {bill.noReferensi || 'PAY-2026-001245'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Sumber / Metode:</span>
                    <span className="font-medium text-slate-800 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      {bill.sumberPembayaran || 'Aplikasi Pembayaran'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-3 text-center border border-dashed border-slate-200">
                  <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-slate-600">
                    Belum ada pembayaran tercatat.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tagihan bulanan wajib dilunasi penuh sekaligus (tidak dapat dicicil).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Bottom Actions */}
          <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/70 flex items-center justify-between gap-3">
            <button
              type="button"
              id="btn-drawer-lihat-santri"
              onClick={() => onViewStudentDetail(bill.nis)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
              <span>Lihat Detail Santri</span>
            </button>

            <button
              type="button"
              id="btn-drawer-cetak-tagihan"
              onClick={() => onPrintBill(bill)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#047857] rounded-xl shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Tagihan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
