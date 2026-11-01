import React, { useState } from 'react';
import {
  Eye,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Tag,
  ChevronLeft,
  ChevronRight,
  FileText,
  Printer,
  Phone,
  ExternalLink,
  Sparkles,
  Utensils,
  Check,
} from 'lucide-react';
import { MonthlyBillRow } from '../../types';

interface MonthlyBillTableProps {
  bills: MonthlyBillRow[];
  totalAll: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewDetail: (bill: MonthlyBillRow) => void;
  onPrintBill: (bill: MonthlyBillRow) => void;
  onViewStudentDetail: (nis: string) => void;
  onOpenGenerateModal: () => void;
}

export const MonthlyBillTable: React.FC<MonthlyBillTableProps> = ({
  bills,
  totalAll,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onPrintBill,
  onViewStudentDetail,
  onOpenGenerateModal,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const totalPages = Math.ceil(bills.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, bills.length);
  const currentBills = bills.slice(startIndex, endIndex);

  // Helper for pagination numbers
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      buttons.push(
        <button
          key={1}
          type="button"
          onClick={() => onPageChange(1)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold ${
            currentPage === 1
              ? 'bg-[#064E3B] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1
        </button>
      );
      if (start > 2) {
        buttons.push(
          <span key="dots1" className="px-1 text-slate-400 text-xs">
            ...
          </span>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          type="button"
          onClick={() => onPageChange(i)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
            currentPage === i
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        buttons.push(
          <span key="dots2" className="px-1 text-slate-400 text-xs">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          type="button"
          onClick={() => onPageChange(totalPages)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold ${
            currentPage === totalPages
              ? 'bg-[#064E3B] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (bills.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-b-xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4 border border-slate-200">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h4 className="text-base font-bold text-[#0F172A]">Belum Ada Tagihan</h4>
        <p className="text-xs text-[#64748B] max-w-sm mt-1 mb-6">
          Tagihan bulanan untuk periode ini belum dibuat atau tidak ada data yang sesuai dengan filter pencarian Anda.
        </p>
        <button
          type="button"
          id="btn-empty-generate-bill"
          onClick={onOpenGenerateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Generate Tagihan Bulanan</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Table with Sticky Header */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-xs text-left border-collapse">
          {/* Sticky Header */}
          <thead className="bg-[#F8FAFC] text-[#475569] uppercase font-bold tracking-wider text-[11px] border-b border-[#E2E8F0] sticky top-0 z-10">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">No</th>
              <th className="py-3.5 px-4 w-24">NIS</th>
              <th className="py-3.5 px-4 min-w-[160px]">Nama Santri</th>
              <th className="py-3.5 px-3 w-16 text-center">Unit</th>
              <th className="py-3.5 px-3 w-20">Kelas</th>
              <th className="py-3.5 px-3 w-24">Paket Makan</th>
              <th className="py-3.5 px-3 text-right">SPP</th>
              <th className="py-3.5 px-3 text-right">Uang Makan</th>
              <th className="py-3.5 px-3 text-right">Listrik & Air</th>
              <th className="py-3.5 px-3 text-right">Diskon</th>
              <th className="py-3.5 px-4 text-right">Total Tagihan</th>
              <th className="py-3.5 px-4 text-center w-28">Status</th>
              <th className="py-3.5 px-4 text-center w-20">Aksi</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#E2E8F0] bg-white">
            {currentBills.map((bill, index) => {
              const rowNum = startIndex + index + 1;
              const isLunas = bill.status === 'LUNAS';

              return (
                <tr
                  key={bill.id}
                  id={`row-bill-${bill.nis}`}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* No */}
                  <td className="py-3 px-4 text-center font-mono text-slate-500 font-medium">
                    {rowNum}
                  </td>

                  {/* NIS */}
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {bill.nis}
                  </td>

                  {/* Nama Santri */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center font-bold text-[11px] flex-shrink-0 border border-emerald-200/80">
                        {bill.namaSantri.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onViewDetail(bill)}
                          className="font-bold text-[#0F172A] hover:text-[#064E3B] transition-colors text-left truncate block"
                        >
                          {bill.namaSantri}
                        </button>
                        {bill.namaWali && (
                          <p className="text-[10px] text-slate-400 truncate">
                            Wali: {bill.namaWali}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Unit */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        bill.unit === 'MTs'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {bill.unit}
                    </span>
                  </td>

                  {/* Kelas */}
                  <td className="py-3 px-3 font-medium text-slate-700">
                    {bill.kelas}
                  </td>

                  {/* Paket Makan */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        bill.paketMakan === 'Paket C'
                          ? 'bg-emerald-50 text-[#064E3B] border border-emerald-200'
                          : bill.paketMakan === 'Paket B'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <Utensils className="w-2.5 h-2.5" />
                      {bill.paketMakan}
                    </span>
                  </td>

                  {/* SPP */}
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-700">
                    {formatRupiah(bill.spp)}
                  </td>

                  {/* Uang Makan */}
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-700">
                    {formatRupiah(bill.uangMakan)}
                  </td>

                  {/* Listrik & Air */}
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-700">
                    {formatRupiah(bill.listrikAir)}
                  </td>

                  {/* Diskon */}
                  <td className="py-3 px-3 text-right font-mono">
                    {bill.diskon > 0 ? (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200"
                        title={bill.diskonKeterangan || 'Potongan khusus'}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        Diskon {formatRupiah(bill.diskon)}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Rp0</span>
                    )}
                  </td>

                  {/* Total Tagihan */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-[13px]">
                    {formatRupiah(bill.totalTagihan)}
                  </td>

                  {/* Status Badges */}
                  <td className="py-3 px-4 text-center">
                    {isLunas ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        LUNAS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="w-3 h-3 text-rose-500" />
                        BELUM LUNAS
                      </span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-3 px-4 text-center relative">
                    <div className="flex items-center justify-center gap-1">
                      {/* Eye Icon Action */}
                      <button
                        type="button"
                        id={`btn-view-bill-${bill.nis}`}
                        onClick={() => onViewDetail(bill)}
                        className="w-7 h-7 rounded-lg text-slate-500 hover:text-[#064E3B] hover:bg-emerald-50 flex items-center justify-center transition-colors border border-transparent hover:border-emerald-200"
                        title="Lihat Detail Tagihan"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* More Menu Trigger */}
                      <div className="relative">
                        <button
                          type="button"
                          id={`btn-menu-bill-${bill.nis}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === bill.id ? null : bill.id);
                          }}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                          title="Menu Aksi Lainnya"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === bill.id && (
                          <>
                            <div
                              className="fixed inset-0 z-20"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  onViewDetail(bill);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#064E3B] flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Rincian Tagihan</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onPrintBill(bill);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-400" />
                                <span>Cetak Kuitansi / Slip</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onViewStudentDetail(bill.nis);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                <span>Detail Keuangan Santri</span>
                              </button>

                              {bill.noHpWali && (
                                <a
                                  href={`https://wa.me/${bill.noHpWali.replace(/[^0-9]/g, '')}?text=Assalamu%27alaikum%20Bpk%2FIbu%20Wali%20dari%20${encodeURIComponent(bill.namaSantri)}.%20Informasi%20tagihan%20bulan%20${encodeURIComponent(bill.periode)}%20sebesar%20${encodeURIComponent(formatRupiah(bill.totalTagihan))}.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setActiveMenuId(null)}
                                  className="w-full px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-50 flex items-center gap-2"
                                >
                                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Pengingat WhatsApp</span>
                                </a>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-b-xl">
        {/* Info Text & Page Size Selector */}
        <div className="flex items-center gap-3 text-xs text-[#64748B]">
          <span>
            Menampilkan <strong>{bills.length > 0 ? startIndex + 1 : 0}–{endIndex}</strong> dari{' '}
            <strong>{bills.length}</strong> Tagihan
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">|</span>
            <span>Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value={10}>10 / halaman</option>
              <option value={25}>25 / halaman</option>
              <option value={50}>50 / halaman</option>
              <option value={100}>100 / halaman</option>
            </select>
          </div>
        </div>

        {/* Page Nav Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            id="btn-prev-page"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">{renderPaginationButtons()}</div>

          <button
            type="button"
            id="btn-next-page"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Halaman Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
