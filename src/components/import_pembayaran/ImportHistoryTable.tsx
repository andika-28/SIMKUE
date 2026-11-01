import React, { useState } from 'react';
import {
  History,
  FileSpreadsheet,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  Landmark,
} from 'lucide-react';
import { ImportHistoryItem } from '../../types';
import { sampleImportHistory } from '../../data/importPaymentData';
import { ImportHistoryDetailModal } from './ImportHistoryDetailModal';

interface ImportHistoryTableProps {
  onDownloadReportPdf: (batchId?: string) => void;
}

export const ImportHistoryTable: React.FC<ImportHistoryTableProps> = ({
  onDownloadReportPdf,
}) => {
  const [historyList, setHistoryList] = useState<ImportHistoryItem[]>(sampleImportHistory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ImportHistoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const filteredHistory = historyList.filter((item) => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      item.importId.toLowerCase().includes(q) ||
      item.namaFile.toLowerCase().includes(q) ||
      item.diimportOleh.toLowerCase().includes(q)
    );
  });

  const handleOpenDetail = (item: ImportHistoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div
      id="import-history-card"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Riwayat Import & Rekonsiliasi Pembayaran
            </h3>
            <p className="text-xs text-slate-500">
              Arsip log audit pemrosesan file pembayaran eksternal SIMKEU
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-import-history"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Batch ID / Nama File..."
            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-[#064E3B] focus:border-[#064E3B] transition-all"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <th className="py-3 px-3 text-center w-10">No</th>
              <th className="py-3 px-3">Waktu Import</th>
              <th className="py-3 px-3">Batch ID</th>
              <th className="py-3 px-3">Nama File</th>
              <th className="py-3 px-3 text-center">Total Data</th>
              <th className="py-3 px-3 text-center">Berhasil</th>
              <th className="py-3 px-3 text-center">Bermasalah</th>
              <th className="py-3 px-3 text-right">Total Nominal</th>
              <th className="py-3 px-3">Diimport Oleh</th>
              <th className="py-3 px-3 text-center">Rekonsiliasi Bank</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredHistory.map((row, idx) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 text-center text-slate-500 font-semibold">
                  {idx + 1}
                </td>

                <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                  {row.tanggalImport}
                </td>

                <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                  {row.importId}
                </td>

                <td className="py-3 px-3 font-medium text-slate-800 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                    <span className="truncate max-w-xs">{row.namaFile}</span>
                  </div>
                </td>

                <td className="py-3 px-3 text-center font-bold text-slate-800">
                  {row.totalData.toLocaleString('id-ID')}
                </td>

                <td className="py-3 px-3 text-center font-bold text-emerald-700">
                  {row.berhasil.toLocaleString('id-ID')}
                </td>

                <td className="py-3 px-3 text-center font-bold text-amber-800">
                  {row.bermasalah > 0 ? (
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                      {row.bermasalah}
                    </span>
                  ) : (
                    <span className="text-slate-400">0</span>
                  )}
                </td>

                <td className="py-3 px-3 text-right font-black text-[#064E3B] whitespace-nowrap">
                  {formatRupiah(row.totalNominal)}
                </td>

                <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                  {row.diimportOleh}
                </td>

                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Landmark className="w-3 h-3 text-emerald-600" />
                    <span>✓ Sesuai</span>
                  </span>
                </td>

                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>{row.status}</span>
                  </span>
                </td>

                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      id={`btn-history-detail-${row.id}`}
                      onClick={() => handleOpenDetail(row)}
                      className="p-1.5 text-slate-500 hover:text-[#064E3B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Lihat Berita Acara"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      id={`btn-history-download-${row.id}`}
                      onClick={() => onDownloadReportPdf(row.importId)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Unduh PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      <ImportHistoryDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        historyItem={selectedItem}
        onDownloadPdf={() => onDownloadReportPdf(selectedItem?.importId)}
      />
    </div>
  );
};
