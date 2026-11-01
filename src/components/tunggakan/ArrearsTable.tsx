import React, { useState } from 'react';
import {
  Eye,
  MoreVertical,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Flame,
  Copy,
  Calendar,
  Layers,
  Receipt,
} from 'lucide-react';
import { StudentArrearItem, ArrearsCategory } from '../../types';

interface ArrearsTableProps {
  arrears: StudentArrearItem[];
  onViewDetail: (item: StudentArrearItem) => void;
  onNavigateToStudentDetail?: (studentId: string) => void;
  onOpenExportModal: () => void;
  onExportExcelQuick: () => void;
  onCopyPhone: (phone: string) => void;
  onSendWhatsapp: (item: StudentArrearItem) => void;
}

export const ArrearsTable: React.FC<ArrearsTableProps> = ({
  arrears,
  onViewDetail,
  onNavigateToStudentDetail,
  onOpenExportModal,
  onExportExcelQuick,
  onCopyPhone,
  onSendWhatsapp,
}) => {
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(arrears.length / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = arrears.slice(startIndex, startIndex + itemsPerPage);

  // Active popover menu state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Active expanded row state for granular breakdown
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const toggleRowExpansion = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const getCategoryBadge = (kategori: ArrearsCategory) => {
    switch (kategori) {
      case '> 3 Bulan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
            <Flame className="w-3 h-3 text-rose-600 fill-rose-600 animate-pulse" />
            &gt; 3 BULAN
          </span>
        );
      case '2–3 Bulan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
            <AlertCircle className="w-3 h-3 text-orange-600" />
            2–3 BULAN
          </span>
        );
      case '1 Bulan':
      case '1–2 Bulan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            1–2 BULAN
          </span>
        );
      case '< 1 Bulan':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-yellow-50 text-yellow-800 border border-yellow-200">
            &lt; 1 BULAN
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col">
      {/* Table Action Bar */}
      <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Daftar Tunggakan Santri
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
              {arrears.length} Santri
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {arrears.length} Santri memiliki tagihan yang belum diselesaikan.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="btn-export-arrears-excel"
            onClick={onExportExcelQuick}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-all shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            id="btn-print-arrears-report"
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="overflow-x-auto min-h-[380px]">
        {arrears.length === 0 ? (
          /* EMPTY STATE (Positive Clean Illustration) */
          <div
            id="empty-state-no-arrears"
            className="flex flex-col items-center justify-center p-12 text-center my-6 space-y-3"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#064E3B] flex items-center justify-center border-2 border-emerald-300 shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-[#064E3B]" />
            </div>
            <div className="max-w-md space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">
                Tidak Ada Tunggakan
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seluruh tagihan santri untuk kriteria ini telah diselesaikan atau tidak ditemukan santri yang memiliki tunggakan aktif.
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            {/* Sticky Table Header */}
            <thead className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-[#E2E8F0] sticky top-0 z-10 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-3 w-8 text-center"></th>
                <th className="py-3.5 px-3 w-12 text-center">No</th>
                <th className="py-3.5 px-3">NIS</th>
                <th className="py-3.5 px-4 min-w-[170px]">Nama Santri</th>
                <th className="py-3.5 px-3 text-center">Unit</th>
                <th className="py-3.5 px-3 text-center">Kelas</th>
                <th className="py-3.5 px-4 text-right min-w-[210px]">
                  Tunggakan Bulanan (Bulan)
                </th>
                <th className="py-3.5 px-4 text-right min-w-[210px]">
                  Tunggakan Tahunan (Per Item)
                </th>
                <th className="py-3.5 px-4 text-right font-black text-rose-900 min-w-[120px]">
                  Total Tunggakan
                </th>
                <th className="py-3.5 px-3 text-center">Periode Terlama</th>
                <th className="py-3.5 px-3 text-center">Kategori</th>
                <th className="py-3.5 px-4 text-center w-24">Aksi</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {paginatedItems.map((item, idx) => {
                const rowNo = startIndex + idx + 1;
                const isHighRisk = item.totalTunggakan >= 3000000 || item.kategori === '> 3 Bulan';
                const isExpanded = expandedRowId === item.id;

                const hasMonthlyArrears = item.tunggakanBulanan > 0;
                const hasYearlyArrears = item.tunggakanTahunan > 0;

                return (
                  <React.Fragment key={item.id}>
                    <tr
                      id={`row-arrear-student-${item.nis}`}
                      className={`hover:bg-slate-50/90 transition-colors group ${
                        isExpanded ? 'bg-emerald-50/20' : isHighRisk ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      {/* Expand Chevron Toggle */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggleRowExpansion(item.id)}
                          className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          title={isExpanded ? 'Tutup rincian' : 'Buka rincian per bulan & per item'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-800" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>

                      {/* No */}
                      <td className="py-3 px-3 text-center text-slate-500 font-medium">
                        {rowNo}
                      </td>

                      {/* NIS */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {item.nis}
                      </td>

                      {/* Nama Santri */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span
                              onClick={() => onViewDetail(item)}
                              className="font-bold text-slate-900 hover:text-[#064E3B] cursor-pointer transition-colors"
                            >
                              {item.namaSantri}
                            </span>
                            {isHighRisk && (
                              <span
                                title="Tunggakan Kritis (> Rp3 Juta / > 3 Bulan)"
                                className="inline-block w-2 h-2 rounded-full bg-rose-600"
                              />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <span>Wali: {item.namaWali}</span>
                          </span>
                        </div>
                      </td>

                      {/* Unit */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.unit === 'MTs'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-[#064E3B] border border-emerald-200'
                          }`}
                        >
                          {item.unit}
                        </span>
                      </td>

                      {/* Kelas */}
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">
                        {item.kelas}
                      </td>

                      {/* Tunggakan Bulanan (Bulan Menunggak) */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-extrabold text-amber-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 text-xs">
                            {formatRupiah(item.tunggakanBulanan)}
                          </span>

                          {hasMonthlyArrears ? (
                            <div className="flex flex-col items-end gap-1 mt-0.5">
                              {/* Pill list of unpaid months */}
                              <div className="flex flex-wrap gap-1 justify-end max-w-[230px]">
                                {item.rincianBulanan && item.rincianBulanan.length > 0 ? (
                                  item.rincianBulanan.map((rb, rIdx) => (
                                    <span
                                      key={rIdx}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-100/90 text-amber-950 border border-amber-300 font-semibold"
                                      title={`Periode ${rb.periode} • Total ${formatRupiah(rb.total)} (SPP: ${formatRupiah(rb.spp)}, Makan: ${formatRupiah(rb.uangMakan)}, Listrik: ${formatRupiah(rb.listrikAir)})`}
                                    >
                                      <span>{rb.periode}</span>
                                      <span className="text-amber-800 font-bold font-mono text-[9px]">
                                        ({formatRupiah(rb.total)})
                                      </span>
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] font-semibold text-amber-800">
                                    {item.periodeTerlama} ({item.jumlahBulanMenunggak} bln)
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              ✓ Lunas
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Tunggakan Tahunan (Per Item) */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-extrabold text-orange-950 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/80 text-xs">
                            {formatRupiah(item.tunggakanTahunan)}
                          </span>

                          {hasYearlyArrears ? (
                            <div className="flex flex-col items-end gap-1 mt-0.5 text-[10px]">
                              {item.rincianTahunan?.pembangunan?.sisa > 0 && (
                                <div className="inline-flex items-center gap-1 bg-orange-50/80 border border-orange-200 px-1.5 py-0.5 rounded text-slate-700">
                                  <span className="text-slate-600 font-medium">Pembangunan:</span>
                                  <strong className="text-orange-950 font-bold font-mono">
                                    {formatRupiah(item.rincianTahunan.pembangunan.sisa)}
                                  </strong>
                                </div>
                              )}
                              {item.rincianTahunan?.kertas?.sisa > 0 && (
                                <div className="inline-flex items-center gap-1 bg-orange-50/80 border border-orange-200 px-1.5 py-0.5 rounded text-slate-700">
                                  <span className="text-slate-600 font-medium">Uang Kertas:</span>
                                  <strong className="text-orange-950 font-bold font-mono">
                                    {formatRupiah(item.rincianTahunan.kertas.sisa)}
                                  </strong>
                                </div>
                              )}
                              {item.rincianTahunan?.kegiatan?.sisa > 0 && (
                                <div className="inline-flex items-center gap-1 bg-orange-50/80 border border-orange-200 px-1.5 py-0.5 rounded text-slate-700">
                                  <span className="text-slate-600 font-medium">Uang Kegiatan:</span>
                                  <strong className="text-orange-950 font-bold font-mono">
                                    {formatRupiah(item.rincianTahunan.kegiatan.sisa)}
                                  </strong>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              ✓ Lunas
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Tunggakan */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-black text-rose-700 text-xs">
                          {formatRupiah(item.totalTunggakan)}
                        </span>
                      </td>

                      {/* Periode Terlama */}
                      <td className="py-3 px-3 text-center font-medium text-slate-600 whitespace-nowrap">
                        {item.periodeTerlama}
                      </td>

                      {/* Kategori */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {getCategoryBadge(item.kategori)}
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-4 text-center relative">
                        <div className="flex items-center justify-center gap-1">
                          {/* Toggle Expand Details */}
                          <button
                            type="button"
                            onClick={() => toggleRowExpansion(item.id)}
                            title={isExpanded ? 'Tutup Rincian' : 'Rincian Per Bulan & Item'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isExpanded
                                ? 'bg-emerald-100 text-[#064E3B]'
                                : 'hover:bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Layers className="w-4 h-4" />
                          </button>

                          {/* Eye Icon for Detail Drawer */}
                          <button
                            type="button"
                            id={`btn-view-detail-${item.nis}`}
                            onClick={() => onViewDetail(item)}
                            title="Lihat Rincian Tunggakan"
                            className="p-1.5 hover:bg-emerald-50 text-slate-600 hover:text-[#064E3B] rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* WhatsApp Reminder Shortcut */}
                          <button
                            type="button"
                            id={`btn-wa-reminder-${item.nis}`}
                            onClick={() => onSendWhatsapp(item)}
                            title="Kirim Pesan WhatsApp ke Wali"
                            className="p-1.5 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          {/* More Menu Dropdown Toggle */}
                          <div className="relative">
                            <button
                              type="button"
                              id={`btn-more-menu-${item.nis}`}
                              onClick={() =>
                                setActiveMenuId(
                                  activeMenuId === item.id ? null : item.id
                                )
                              }
                              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Popover Menu */}
                            {activeMenuId === item.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-20"
                                  onClick={() => setActiveMenuId(null)}
                                />
                                <div className="absolute right-0 top-8 z-30 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-xs text-left animate-in fade-in-50">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onViewDetail(item);
                                    }}
                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-semibold cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-[#064E3B]" />
                                    <span>Lihat Rincian Tagihan</span>
                                  </button>

                                  {onNavigateToStudentDetail && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuId(null);
                                        onNavigateToStudentDetail(item.nis);
                                      }}
                                      className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-semibold cursor-pointer"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                                      <span>Detail Keuangan Santri</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onCopyPhone(item.noHpWali);
                                    }}
                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-semibold cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Salin No. HP Wali</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onSendWhatsapp(item);
                                    }}
                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-semibold cursor-pointer border-t border-slate-100"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Kirim Notifikasi WA</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDABLE ITEM-LEVEL DETAILS ACCORDION ROW */}
                    {isExpanded && (
                      <tr className="bg-slate-50/80 border-b border-slate-200">
                        <td colSpan={12} className="p-4 sm:p-5">
                          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 text-xs">
                                  Rincian Item Tunggakan: {item.namaSantri} (NIS: {item.nis})
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  • {item.unit} {item.kelas}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => onViewDetail(item)}
                                  className="text-xs font-bold text-[#064E3B] hover:underline flex items-center gap-1"
                                >
                                  <span>Buka Panel Lengkap</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {/* 1. Monthly Arrears Table */}
                              <div className="border border-amber-200 rounded-xl p-3.5 bg-amber-50/20 space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <Receipt className="w-4 h-4 text-amber-700" />
                                    <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                                      Tunggakan Bulanan (Per Bulan)
                                    </h5>
                                  </div>
                                  <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                    Total: {formatRupiah(item.tunggakanBulanan)}
                                  </span>
                                </div>

                                {item.rincianBulanan && item.rincianBulanan.length > 0 ? (
                                  <div className="overflow-x-auto rounded-lg border border-amber-200/80 bg-white">
                                    <table className="w-full text-left text-[11px]">
                                      <thead className="bg-amber-50/90 text-amber-900 font-bold border-b border-amber-200 text-[10px] uppercase">
                                        <tr>
                                          <th className="py-2 px-2.5">Bulan</th>
                                          <th className="py-2 px-2 text-right">SPP</th>
                                          <th className="py-2 px-2 text-right">Makan</th>
                                          <th className="py-2 px-2 text-right">Listrik</th>
                                          <th className="py-2 px-2.5 text-right font-black text-rose-900">Total</th>
                                          <th className="py-2 px-2 text-center">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-amber-100 text-slate-700">
                                        {item.rincianBulanan.map((rb, rIdx) => (
                                          <tr key={rIdx} className="hover:bg-amber-50/40">
                                            <td className="py-2 px-2.5 font-bold text-slate-900">
                                              {rb.periode}
                                            </td>
                                            <td className="py-2 px-2 text-right font-mono text-slate-600">
                                              {formatRupiah(rb.spp)}
                                            </td>
                                            <td className="py-2 px-2 text-right font-mono text-slate-600">
                                              {formatRupiah(rb.uangMakan)}
                                            </td>
                                            <td className="py-2 px-2 text-right font-mono text-slate-600">
                                              {formatRupiah(rb.listrikAir)}
                                            </td>
                                            <td className="py-2 px-2.5 text-right font-extrabold text-rose-700 font-mono">
                                              {formatRupiah(rb.total)}
                                            </td>
                                            <td className="py-2 px-2 text-center">
                                              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-100 text-rose-800">
                                                {rb.status}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="p-3 bg-white rounded-lg border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Tidak ada tunggakan bulanan aktif. Seluruh iuran bulanan telah lunas.</span>
                                  </div>
                                )}
                              </div>

                              {/* 2. Yearly Arrears Breakdown Cards */}
                              <div className="border border-orange-200 rounded-xl p-3.5 bg-orange-50/20 space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-orange-700" />
                                    <h5 className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                                      Tunggakan Tahunan (Per Komponen Biaya)
                                    </h5>
                                  </div>
                                  <span className="text-xs font-extrabold text-orange-900 bg-orange-100 px-2 py-0.5 rounded border border-orange-300">
                                    Total Sisa: {formatRupiah(item.tunggakanTahunan)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {/* Pembangunan */}
                                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                                      Uang Pembangunan
                                    </div>
                                    <div className="text-[11px] text-slate-600">
                                      <div>Tagihan: <span className="font-semibold text-slate-800">{formatRupiah(item.rincianTahunan?.pembangunan?.total || 0)}</span></div>
                                      <div>Dibayar: <span className="font-semibold text-emerald-700">{formatRupiah(item.rincianTahunan?.pembangunan?.sudahDibayar || 0)}</span></div>
                                    </div>
                                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                                      <span className="text-[10px] text-slate-500 font-medium">Sisa:</span>
                                      <span className={`text-xs font-bold font-mono ${
                                        (item.rincianTahunan?.pembangunan?.sisa || 0) > 0 ? 'text-orange-700' : 'text-emerald-700'
                                      }`}>
                                        {formatRupiah(item.rincianTahunan?.pembangunan?.sisa || 0)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Uang Kertas */}
                                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                                      Uang Kertas
                                    </div>
                                    <div className="text-[11px] text-slate-600">
                                      <div>Tagihan: <span className="font-semibold text-slate-800">{formatRupiah(item.rincianTahunan?.kertas?.total || 0)}</span></div>
                                      <div>Dibayar: <span className="font-semibold text-emerald-700">{formatRupiah(item.rincianTahunan?.kertas?.sudahDibayar || 0)}</span></div>
                                    </div>
                                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                                      <span className="text-[10px] text-slate-500 font-medium">Sisa:</span>
                                      <span className={`text-xs font-bold font-mono ${
                                        (item.rincianTahunan?.kertas?.sisa || 0) > 0 ? 'text-orange-700' : 'text-emerald-700'
                                      }`}>
                                        {formatRupiah(item.rincianTahunan?.kertas?.sisa || 0)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Uang Kegiatan */}
                                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                                      Uang Kegiatan
                                    </div>
                                    <div className="text-[11px] text-slate-600">
                                      <div>Tagihan: <span className="font-semibold text-slate-800">{formatRupiah(item.rincianTahunan?.kegiatan?.total || 0)}</span></div>
                                      <div>Dibayar: <span className="font-semibold text-emerald-700">{formatRupiah(item.rincianTahunan?.kegiatan?.sudahDibayar || 0)}</span></div>
                                    </div>
                                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                                      <span className="text-[10px] text-slate-500 font-medium">Sisa:</span>
                                      <span className={`text-xs font-bold font-mono ${
                                        (item.rincianTahunan?.kegiatan?.sisa || 0) > 0 ? 'text-orange-700' : 'text-emerald-700'
                                      }`}>
                                        {formatRupiah(item.rincianTahunan?.kegiatan?.sisa || 0)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {arrears.length > 0 && (
        <div className="p-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-white">
          <span>
            Menampilkan <span className="font-bold text-slate-800">{startIndex + 1}</span> hingga{' '}
            <span className="font-bold text-slate-800">
              {Math.min(startIndex + itemsPerPage, arrears.length)}
            </span>{' '}
            dari <span className="font-bold text-slate-800">{arrears.length}</span> total santri
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#064E3B] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
