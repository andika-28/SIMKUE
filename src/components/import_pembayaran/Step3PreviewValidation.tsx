import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Search,
  SlidersHorizontal,
  Eye,
  FileSpreadsheet,
  Check,
  ShieldCheck,
  Ban,
  Save,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { ImportPaymentRecord, ImportValidationStatus } from '../../types';
import { sampleImportPaymentRecords } from '../../data/importPaymentData';
import { ErrorDetailDrawer } from './ErrorDetailDrawer';

interface Step3PreviewValidationProps {
  onBackStep: () => void;
  onNextStep: () => void;
  onSaveDraft?: () => void;
}

export const Step3PreviewValidation: React.FC<Step3PreviewValidationProps> = ({
  onBackStep,
  onNextStep,
  onSaveDraft,
}) => {
  const [records, setRecords] = useState<ImportPaymentRecord[]>(sampleImportPaymentRecords);
  const [activeTab, setActiveTab] = useState<'ALL' | ImportValidationStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<ImportPaymentRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  // Counts
  const totalCount = 1245;
  const validCount = 1220;
  const reviewCount = 15;
  const duplicateCount = 10;
  const notFoundCount = 0;

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Tab filter
      if (activeTab !== 'ALL' && rec.statusValidasi !== activeTab) {
        return false;
      }

      // Search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = rec.namaSantri.toLowerCase().includes(q);
        const matchNis = rec.nis.toLowerCase().includes(q);
        const matchRef = rec.nomorReferensi.toLowerCase().includes(q);
        if (!matchName && !matchNis && !matchRef) return false;
      }

      return true;
    });
  }, [records, activeTab, searchQuery]);

  const handleOpenDetail = (record: ImportPaymentRecord) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const handleUpdateRecordAction = (
    recordId: string,
    action: 'PROSES' | 'LEWATI' | 'TANDAI'
  ) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, actionTaken: action } : r))
    );
  };

  return (
    <div id="step-3-preview-validation" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Preview & Validasi Pembayaran
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Periksa hasil pencocokan tagihan otomatis SIMKEU sebelum data diproses dan dicatatkan ke kas bank.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Sistem Matching Aktif: NIS + Jenis + Periode</span>
            </span>
          </div>
        </div>

        {/* Validation Summary Cards (4 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {/* Card 1: Total Transaksi */}
          <div
            onClick={() => setActiveTab('ALL')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
              Total Transaksi
            </span>
            <div className="text-xl font-black mt-0.5">
              {totalCount.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] opacity-75 mt-1 block">Seluruh data file</span>
          </div>

          {/* Card 2: Valid */}
          <div
            onClick={() => setActiveTab('VALID')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'VALID'
                ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-900'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
              Valid (Cocok Penuh)
            </span>
            <div className="text-xl font-black mt-0.5 text-emerald-700 activeTab==='VALID' ? text-white : ''">
              {validCount.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] opacity-75 mt-1 block">98% siap diproses</span>
          </div>

          {/* Card 3: Perlu Validasi */}
          <div
            onClick={() => setActiveTab('PERLU_VALIDASI')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'PERLU_VALIDASI'
                ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100/70 border-amber-300 text-amber-950'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
              Perlu Validasi
            </span>
            <div className="text-xl font-black mt-0.5 text-amber-900">
              {reviewCount}
            </div>
            <span className="text-[10px] opacity-75 mt-1 block">Nominal parsial / selisih</span>
          </div>

          {/* Card 4: Duplikat */}
          <div
            onClick={() => setActiveTab('DUPLIKAT')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'DUPLIKAT'
                ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                : 'bg-rose-50 hover:bg-rose-100/70 border-rose-300 text-rose-950'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
              Duplikat
            </span>
            <div className="text-xl font-black mt-0.5 text-rose-900">
              {duplicateCount}
            </div>
            <span className="text-[10px] opacity-75 mt-1 block">No. Ref pernah diproses</span>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              id="tab-all-validations"
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Semua ({totalCount.toLocaleString('id-ID')})
            </button>

            <button
              type="button"
              id="tab-valid-only"
              onClick={() => setActiveTab('VALID')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'VALID'
                  ? 'bg-[#064E3B] text-white'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              Valid ({validCount.toLocaleString('id-ID')})
            </button>

            <button
              type="button"
              id="tab-review-only"
              onClick={() => setActiveTab('PERLU_VALIDASI')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'PERLU_VALIDASI'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              Perlu Validasi ({reviewCount})
            </button>

            <button
              type="button"
              id="tab-duplicate-only"
              onClick={() => setActiveTab('DUPLIKAT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'DUPLIKAT'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
              }`}
            >
              Duplikat ({duplicateCount})
            </button>

            <button
              type="button"
              id="tab-notfound-only"
              onClick={() => setActiveTab('TIDAK_DITEMUKAN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'TIDAK_DITEMUKAN'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500'
              }`}
            >
              Tidak Cocok ({notFoundCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-preview-transactions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari NIS, Nama, Ref..."
              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-[#064E3B] focus:border-[#064E3B] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Preview Table */}
      <div
        id="preview-validation-table-card"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3 px-3 text-center w-10">No</th>
                <th className="py-3 px-3">Nomor Referensi</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">NIS</th>
                <th className="py-3 px-3">Nama Santri</th>
                <th className="py-3 px-3">Jenis Pembayaran</th>
                <th className="py-3 px-3 text-right">Nominal</th>
                <th className="py-3 px-3">Tagihan Ditemukan</th>
                <th className="py-3 px-3 text-center">Status Validasi</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((item, idx) => {
                const isValid = item.statusValidasi === 'VALID';
                const isReview = item.statusValidasi === 'PERLU_VALIDASI';
                const isDuplicate = item.statusValidasi === 'DUPLIKAT';

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isDuplicate
                        ? 'bg-rose-50/20'
                        : isReview
                        ? 'bg-amber-50/20'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center text-slate-500 font-semibold">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {item.nomorReferensi}
                    </td>

                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {item.tanggal}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-700 font-bold">
                      {item.nis}
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-900">
                      <div>{item.namaSantri}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {item.unit} • {item.kelas}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      <span className="font-semibold">{item.jenisPembayaran}</span>
                    </td>

                    <td className="py-3 px-3 text-right font-black text-slate-900 whitespace-nowrap">
                      {formatRupiah(item.nominal)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold ${
                            isValid
                              ? 'text-emerald-800'
                              : isReview
                              ? 'text-amber-800'
                              : 'text-rose-800'
                          }`}
                        >
                          {item.tagihanDitemukan}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {item.matchingConfidence}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {isValid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs">
                          <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                          <span>✓ Data Cocok</span>
                        </span>
                      ) : isReview ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          <span>⚠ Perlu Pemeriksaan</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-900 border border-rose-200 shadow-2xs">
                          <AlertCircle className="w-3 h-3 text-rose-700" />
                          <span>⛔ Duplikat</span>
                        </span>
                      )}
                    </td>

                    {/* Action Column */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {isValid ? (
                        <button
                          type="button"
                          id={`btn-view-valid-${item.id}`}
                          onClick={() => handleOpenDetail(item)}
                          className="p-1.5 text-slate-400 hover:text-[#064E3B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Detail Transaksi"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      ) : isReview ? (
                        <button
                          type="button"
                          id={`btn-inspect-review-${item.id}`}
                          onClick={() => handleOpenDetail(item)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-300 text-[10px] transition-colors cursor-pointer shadow-2xs"
                        >
                          Periksa
                        </button>
                      ) : (
                        <button
                          type="button"
                          id={`btn-view-dup-${item.id}`}
                          onClick={() => handleOpenDetail(item)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold rounded-lg border border-rose-200 text-[10px] transition-colors cursor-pointer shadow-2xs"
                        >
                          Lihat Transaksi
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Menampilkan <strong className="text-slate-800">{filteredRecords.length}</strong> dari{' '}
            <strong className="text-slate-800">{records.length}</strong> baris sampel (Total {totalCount.toLocaleString('id-ID')} pada file)
          </span>
          <span className="text-[11px] text-emerald-800 font-bold">
            Total Nominal Valid: {formatRupiah(325500000)}
          </span>
        </div>
      </div>

      {/* Step 3 Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          id="btn-back-to-mapping"
          onClick={onBackStep}
          className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            id="btn-save-draft"
            onClick={onSaveDraft}
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Simpan sebagai Draft</span>
          </button>

          <button
            type="button"
            id="btn-next-to-confirm"
            onClick={onNextStep}
            className="px-6 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>Lanjutkan ke Konfirmasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide-over Drawer for Error Detail */}
      <ErrorDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        record={selectedRecord}
        onUpdateAction={handleUpdateRecordAction}
      />
    </div>
  );
};
