import React, { useState } from 'react';
import {
  Eye,
  MoreVertical,
  Printer,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import { YearlyBillRow } from '../../types';

interface YearlyBillTableProps {
  bills: YearlyBillRow[];
  onViewDetail: (bill: YearlyBillRow) => void;
  onPrintReceipt: (bill: YearlyBillRow) => void;
  onRecordPayment: (bill: YearlyBillRow) => void;
  onSendWhatsapp: (bill: YearlyBillRow) => void;
  onOpenGenerateModal: () => void;
}

export const YearlyBillTable: React.FC<YearlyBillTableProps> = ({
  bills,
  onViewDetail,
  onPrintReceipt,
  onRecordPayment,
  onSendWhatsapp,
  onOpenGenerateModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(bills.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBills = bills.slice(startIndex, startIndex + itemsPerPage);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const getStatusBadge = (status: 'LUNAS' | 'SEBAGIAN' | 'BELUM DIBAYAR') => {
    switch (status) {
      case 'LUNAS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-[#064E3B] border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>LUNAS</span>
          </span>
        );
      case 'SEBAGIAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>SEBAGIAN</span>
          </span>
        );
      case 'BELUM DIBAYAR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>BELUM DIBAYAR</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusSantriBadge = (statusSantri: 'Santri Baru' | 'Santri Lama') => {
    if (statusSantri === 'Santri Baru') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
          Santri Baru
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
        Santri Lama
      </span>
    );
  };

  return (
    <div id="yearly-bill-table-container" className="flex flex-col">
      {/* Table responsive wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          {/* Sticky Table Header */}
          <thead className="bg-slate-50/90 sticky top-0 z-10 border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">No</th>
              <th className="py-3.5 px-4">NIS</th>
              <th className="py-3.5 px-4 min-w-[160px]">Nama Santri</th>
              <th className="py-3.5 px-3">Unit</th>
              <th className="py-3.5 px-3">Kelas</th>
              <th className="py-3.5 px-4 text-center">Status Santri</th>
              <th className="py-3.5 px-4 text-right">Uang Pembangunan</th>
              <th className="py-3.5 px-4 text-right">Uang Kertas</th>
              <th className="py-3.5 px-4 text-right">Uang Kegiatan</th>
              <th className="py-3.5 px-4 text-right font-black text-slate-900">Total Tagihan</th>
              <th className="py-3.5 px-4 min-w-[140px]">Sudah Dibayar</th>
              <th className="py-3.5 px-4 text-right">Sisa Tagihan</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center w-20">Aksi</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedBills.length === 0 ? (
              <tr>
                <td colSpan={14} className="py-14 text-center">
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center">
                      <FileSpreadsheet className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Tidak Ada Data Tagihan Tahunan Ditemukan
                    </h4>
                    <p className="text-xs text-slate-500">
                      Silakan ubah kata kunci pencarian atau sesuaikan filter untuk melihat data lainnya.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedBills.map((bill, idx) => {
                const actualIndex = startIndex + idx + 1;
                const isMenuOpen = activeMenuId === bill.id;
                const progressPct = bill.persentaseBayar;

                return (
                  <tr
                    key={bill.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* 1. No */}
                    <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                      {actualIndex}
                    </td>

                    {/* 2. NIS */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {bill.nis}
                    </td>

                    {/* 3. Nama Santri */}
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">
                      <button
                        type="button"
                        onClick={() => onViewDetail(bill)}
                        className="text-left hover:text-[#064E3B] hover:underline focus:outline-none transition-colors"
                      >
                        {bill.namaSantri}
                      </button>
                    </td>

                    {/* 4. Unit */}
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {bill.unit}
                      </span>
                    </td>

                    {/* 5. Kelas */}
                    <td className="py-3.5 px-3 font-medium text-slate-700">
                      {bill.kelas}
                    </td>

                    {/* 6. Status Santri */}
                    <td className="py-3.5 px-4 text-center">
                      {getStatusSantriBadge(bill.statusSantri)}
                    </td>

                    {/* 7. Uang Pembangunan */}
                    <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                      {formatRupiah(bill.uangPembangunan)}
                    </td>

                    {/* 8. Uang Kertas */}
                    <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                      {formatRupiah(bill.uangKertas)}
                    </td>

                    {/* 9. Uang Kegiatan */}
                    <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                      {formatRupiah(bill.uangKegiatan)}
                    </td>

                    {/* 10. Total Tagihan */}
                    <td className="py-3.5 px-4 text-right font-black text-[#0F172A]">
                      {formatRupiah(bill.totalTagihan)}
                    </td>

                    {/* 11. Sudah Dibayar with Progress Indicator */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">
                            {formatRupiah(bill.sudahDibayar)}
                          </span>
                          <span
                            className={`font-extrabold ${
                              progressPct === 100
                                ? 'text-emerald-700'
                                : progressPct > 0
                                ? 'text-amber-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {progressPct}%
                          </span>
                        </div>
                        {/* Thin Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/60">
                          <div
                            className={`h-full rounded-full transition-all ${
                              progressPct === 100
                                ? 'bg-emerald-600'
                                : progressPct > 0
                                ? 'bg-amber-500'
                                : 'bg-slate-300'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* 12. Sisa Tagihan */}
                    <td className="py-3.5 px-4 text-right">
                      {(() => {
                        const sisaPembangunan = Math.max(
                          0,
                          bill.uangPembangunan - (bill.pembangunanTerbayar || 0)
                        );
                        const terbayarKertas =
                          (bill.uangKertasGanjil?.terbayar || 0) +
                          (bill.uangKertasGenap?.terbayar || 0);
                        const sisaKertas = Math.max(0, bill.uangKertas - terbayarKertas);
                        const terbayarKegiatan =
                          (bill.uangKegiatanGanjil?.terbayar || 0) +
                          (bill.uangKegiatanGenap?.terbayar || 0);
                        const sisaKegiatan = Math.max(
                          0,
                          bill.uangKegiatan - terbayarKegiatan
                        );

                        return (
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`font-black text-xs ${
                                bill.sisaTagihan === 0
                                  ? 'text-emerald-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {formatRupiah(bill.sisaTagihan)}
                            </span>
                            {bill.sisaTagihan > 0 ? (
                              <div className="flex flex-col items-end gap-0.5 text-[10px]">
                                {sisaPembangunan > 0 && (
                                  <span className="text-slate-600 bg-rose-50/80 border border-rose-200/60 px-1.5 py-0.5 rounded whitespace-nowrap">
                                    Pembangunan:{' '}
                                    <strong className="text-rose-950 font-bold font-mono">
                                      {formatRupiah(sisaPembangunan)}
                                    </strong>
                                  </span>
                                )}
                                {sisaKertas > 0 && (
                                  <span className="text-slate-600 bg-rose-50/80 border border-rose-200/60 px-1.5 py-0.5 rounded whitespace-nowrap">
                                    Kertas:{' '}
                                    <strong className="text-rose-950 font-bold font-mono">
                                      {formatRupiah(sisaKertas)}
                                    </strong>
                                  </span>
                                )}
                                {sisaKegiatan > 0 && (
                                  <span className="text-slate-600 bg-rose-50/80 border border-rose-200/60 px-1.5 py-0.5 rounded whitespace-nowrap">
                                    Kegiatan:{' '}
                                    <strong className="text-rose-950 font-bold font-mono">
                                      {formatRupiah(sisaKegiatan)}
                                    </strong>
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                ✓ Lunas
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    {/* 13. Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(bill.status)}
                    </td>

                    {/* 14. Aksi */}
                    <td className="py-3.5 px-4 text-center relative">
                      <div className="inline-flex items-center gap-1">
                        {/* Eye Button -> View Detail Drawer */}
                        <button
                          type="button"
                          id={`btn-view-yearly-${bill.nis}`}
                          onClick={() => onViewDetail(bill)}
                          className="p-1.5 text-slate-500 hover:text-[#064E3B] hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Lihat Detail Tagihan"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* More Menu Trigger */}
                        <button
                          type="button"
                          id={`btn-menu-yearly-${bill.nis}`}
                          onClick={() =>
                            setActiveMenuId(isMenuOpen ? null : bill.id)
                          }
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Menu Aksi"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Dropdown Menu Popup */}
                      {isMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-4 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 text-left text-xs animate-in fade-in-50 zoom-in-95">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onViewDetail(bill);
                              }}
                              className="w-full px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#064E3B]" />
                              <span>Lihat Detail Lengkap</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onPrintReceipt(bill);
                              }}
                              className="w-full px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                            >
                              <Printer className="w-3.5 h-3.5 text-blue-600" />
                              <span>Cetak Kuitansi / Tagihan</span>
                            </button>

                            {bill.sisaTagihan > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onRecordPayment(bill);
                                }}
                                className="w-full px-3.5 py-2 text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 font-bold"
                              >
                                <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Bayar Cicilan / Lunas</span>
                              </button>
                            )}

                            {bill.noHpWali && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onSendWhatsapp(bill);
                                }}
                                className="w-full px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Kirim Pengingat WA</span>
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {bills.length > 0 && (
        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Menampilkan <strong className="text-slate-800">{startIndex + 1}</strong> -{' '}
            <strong className="text-slate-800">
              {Math.min(startIndex + itemsPerPage, bills.length)}
            </strong>{' '}
            dari <strong className="text-slate-800">{bills.length}</strong> data santri
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="btn-prev-page-yearly"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-3 py-1 font-bold text-slate-700 bg-white border border-slate-300 rounded-lg text-xs">
              Halaman {currentPage} dari {totalPages}
            </div>

            <button
              type="button"
              id="btn-next-page-yearly"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
