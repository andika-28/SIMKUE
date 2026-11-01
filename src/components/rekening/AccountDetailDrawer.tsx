import React, { useState, useMemo } from 'react';
import {
  X,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Search,
  Filter,
  ArrowLeftRight,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  ShieldCheck,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatRupiah } from '../../data/initialData';
import { BankAccountItem, BankMutationItem } from '../../types';

interface AccountDetailDrawerProps {
  account: BankAccountItem | null;
  allMutations: BankMutationItem[];
  trendHistory: { date: string; 'BNI Operasional': number; 'BNI Utama': number; Total: number }[];
  isOpen: boolean;
  onClose: () => void;
  onOpenTransferModal: (sourceAccountId: string) => void;
  onOpenAdjustmentModal: (accountId: string) => void;
  onShowToast: (msg: string) => void;
}

export const AccountDetailDrawer: React.FC<AccountDetailDrawerProps> = ({
  account,
  allMutations,
  trendHistory,
  isOpen,
  onClose,
  onOpenTransferModal,
  onOpenAdjustmentModal,
  onShowToast,
}) => {
  if (!isOpen || !account) return null;

  const [activeTab, setActiveTab] = useState<'SEMUA' | 'MASUK' | 'KELUAR' | 'TRANSFER'>('SEMUA');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isUnmasked, setIsUnmasked] = useState(false);

  // Filter mutations for this specific account
  const accountMutations = useMemo(() => {
    return allMutations.filter((m) => m.bankAccountId === account.id);
  }, [allMutations, account.id]);

  const filteredMutations = useMemo(() => {
    return accountMutations.filter((m) => {
      const matchTab =
        activeTab === 'SEMUA' ||
        (activeTab === 'MASUK' && m.type === 'MASUK') ||
        (activeTab === 'KELUAR' && m.type === 'KELUAR') ||
        (activeTab === 'TRANSFER' && m.type === 'TRANSFER');

      const matchCategory =
        selectedCategory === 'ALL' || m.category === selectedCategory;

      const matchSearch =
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.transactionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.referenceNo && m.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchTab && matchCategory && matchSearch;
    });
  }, [accountMutations, activeTab, selectedCategory, searchTerm]);

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const set = new Set<string>();
    accountMutations.forEach((m) => set.add(m.category));
    return Array.from(set);
  }, [accountMutations]);

  // Chart data for this account
  const chartData = useMemo(() => {
    const isOperasional = account.accountName.includes('Operasional');
    return trendHistory.map((item) => ({
      date: item.date,
      balance: isOperasional ? item['BNI Operasional'] : item['BNI Utama'],
    }));
  }, [trendHistory, account]);

  const displayAccNo = isUnmasked ? account.accountNumber : account.accountNumberMasked;

  const handleExportExcel = () => {
    onShowToast(`Mutasi rekening ${account.accountName} berhasil diekspor ke format Excel.`);
  };

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-[#F8FAFC] w-full max-w-4xl min-h-screen shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#005E6A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              BNI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {account.accountName}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {account.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                <span>No. Rekening: {displayAccNo}</span>
                <button
                  onClick={() => setIsUnmasked(!isUnmasked)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {isUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <span>•</span>
                <span className="font-sans text-slate-600 font-medium">{account.atasNama}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintStatement}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Cetak Rekening Koran"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportExcel}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-emerald-700 transition-colors"
              title="Ekspor ke Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* 1. Account Balance Hero with Calculation Formula */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  SALDO SISTEM SAAT INI
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                  {formatRupiah(account.saldo)}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Periode Aktif: <span className="font-semibold text-slate-700">Agustus 2026</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenTransferModal(account.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition-colors border border-emerald-200"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Transfer Dana
                </button>
                <button
                  onClick={() => onOpenAdjustmentModal(account.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Koreksi Saldo
                </button>
              </div>
            </div>

            {/* Formula Visualization Step */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-3">
                Kalkulasi Formula Saldo Sistem (Bulan Ini)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {/* Step 1: Saldo Awal */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Saldo Awal (1 Agu)</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {formatRupiah(account.saldoAwal)}
                  </span>
                </div>

                {/* Step 2: Total Masuk */}
                <div className="bg-white p-3 rounded-lg border border-emerald-200 bg-emerald-50/30">
                  <span className="text-[10px] text-emerald-700 font-medium block">+ Total Masuk</span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                    +{formatRupiah(account.totalMasukBulanIni)}
                  </span>
                </div>

                {/* Step 3: Total Keluar */}
                <div className="bg-white p-3 rounded-lg border border-rose-200 bg-rose-50/30">
                  <span className="text-[10px] text-rose-600 font-medium block">- Total Keluar</span>
                  <span className="text-xs font-bold text-rose-600 mt-0.5 block">
                    -{formatRupiah(account.totalKeluarBulanIni)}
                  </span>
                </div>

                {/* Step 4: Saldo Akhir */}
                <div className="bg-emerald-800 text-white p-3 rounded-lg shadow-2xs">
                  <span className="text-[10px] text-emerald-200 font-medium block">= Saldo Akhir</span>
                  <span className="text-xs font-extrabold text-white mt-0.5 block">
                    {formatRupiah(account.saldo)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Balance History Chart: Tren Saldo Rekening */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Tren Saldo Rekening ({account.accountName})
                </h4>
                <p className="text-xs text-slate-400">
                  Pergerakan akumulasi saldo harian sepanjang bulan Agustus 2026
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5" />
                Tren Positif
              </div>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `Rp${val / 1000000}Jt`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatRupiah(Number(val)), 'Saldo']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      borderColor: '#E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    name="Saldo"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#FFFFFF' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Account Transaction History (Mutasi Transaksi) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Mutasi Transaksi ({filteredMutations.length} Transaksi)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Daftar seluruh transaksi yang mendebit/mengkredit rekening ini
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('SEMUA')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'SEMUA'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setActiveTab('MASUK')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'MASUK'
                        ? 'bg-white text-emerald-800 shadow-2xs'
                        : 'text-slate-500 hover:text-emerald-700'
                    }`}
                  >
                    Pemasukan
                  </button>
                  <button
                    onClick={() => setActiveTab('KELUAR')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'KELUAR'
                        ? 'bg-white text-rose-700 shadow-2xs'
                        : 'text-slate-500 hover:text-rose-600'
                    }`}
                  >
                    Pengeluaran
                  </button>
                  <button
                    onClick={() => setActiveTab('TRANSFER')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'TRANSFER'
                        ? 'bg-white text-cyan-800 shadow-2xs'
                        : 'text-slate-500 hover:text-cyan-700'
                    }`}
                  >
                    Transfer
                  </button>
                </div>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari transaksi, deskripsi, no referensi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
                >
                  <option value="ALL">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mutation Table */}
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px] z-10">
                  <tr>
                    <th className="py-3 px-3.5">Tanggal</th>
                    <th className="py-3 px-3.5">No. Transaksi</th>
                    <th className="py-3 px-3.5">Keterangan</th>
                    <th className="py-3 px-3.5">Kategori & Sumber</th>
                    <th className="py-3 px-3.5 text-right">Masuk</th>
                    <th className="py-3 px-3.5 text-right">Keluar</th>
                    <th className="py-3 px-3.5 text-right">Saldo Setelah</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredMutations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Tidak ada riwayat mutasi transaksi sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredMutations.map((m) => {
                      const isIncome = m.type === 'MASUK';
                      const isExpense = m.type === 'KELUAR';

                      return (
                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3.5 whitespace-nowrap text-slate-500 text-[11px]">
                            <div>{m.date}</div>
                            <div className="text-[10px] text-slate-400">{m.time}</div>
                          </td>

                          <td className="py-3 px-3.5 font-mono text-[11px] font-semibold text-slate-700 whitespace-nowrap">
                            {m.transactionNo}
                          </td>

                          <td className="py-3 px-3.5 max-w-[220px]">
                            <div className="font-semibold text-slate-900 truncate">
                              {m.description}
                            </div>
                            {m.notes && (
                              <div className="text-[10px] text-slate-400 truncate">{m.notes}</div>
                            )}
                          </td>

                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="font-semibold text-slate-800 block text-[11px]">
                              {m.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {m.sourceLabel}
                            </span>
                          </td>

                          {/* Masuk */}
                          <td className="py-3 px-3.5 text-right whitespace-nowrap">
                            {isIncome ? (
                              <span className="font-bold text-emerald-700">
                                +{formatRupiah(m.amount)}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>

                          {/* Keluar */}
                          <td className="py-3 px-3.5 text-right whitespace-nowrap">
                            {isExpense || m.type === 'TRANSFER' ? (
                              <span className="font-bold text-rose-600">
                                -{formatRupiah(m.amount)}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>

                          {/* Saldo Setelah */}
                          <td className="py-3 px-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                            {formatRupiah(m.balanceAfter)}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Pencatatan mutasi tunduk pada prinsip pembukuan imutabel & sistem gateway perbankan.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
