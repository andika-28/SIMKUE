import React, { useState } from 'react';
import {
  Landmark,
  Plus,
  ArrowLeftRight,
  FileCheck2,
  Eye,
  EyeOff,
  Edit2,
  FileText,
  Search,
  CheckCircle2,
  MoreVertical,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { formatRupiah } from '../../data/initialData';
import { BankAccountItem, BankManagementRole } from '../../types';

interface AccountListTableProps {
  accounts: BankAccountItem[];
  currentRole: BankManagementRole;
  onOpenAddModal: () => void;
  onOpenTransferModal: (sourceAccountId?: string) => void;
  onOpenAdjustmentModal: (accountId?: string) => void;
  onSelectAccountDetail: (account: BankAccountItem) => void;
  onSelectAccountMutation: (account: BankAccountItem) => void;
  onEditAccount: (account: BankAccountItem) => void;
}

export const AccountListTable: React.FC<AccountListTableProps> = ({
  accounts,
  currentRole,
  onOpenAddModal,
  onOpenTransferModal,
  onOpenAdjustmentModal,
  onSelectAccountDetail,
  onSelectAccountMutation,
  onEditAccount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AKTIF' | 'NONAKTIF'>('ALL');
  const [unmaskedRows, setUnmaskedRows] = useState<Record<string, boolean>>({});

  const toggleRowMask = (id: string) => {
    setUnmaskedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountNumber.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'ALL' || acc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div
      id="daftar-rekening-section"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
    >
      {/* Table Header Section */}
      <div className="p-6 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Daftar Rekening Bank
              </h3>
              <p className="text-xs text-slate-500">
                Kelola seluruh rekening bank pesantren, saldo sistem, dan status pencatatan.
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions & Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari rekening / nomor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 w-48 sm:w-56"
            />
          </div>

          <button
            id="btn-table-add-rekening"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Rekening
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 w-12 text-center">No</th>
              <th className="py-3.5 px-4">Bank</th>
              <th className="py-3.5 px-4">Nama Rekening</th>
              <th className="py-3.5 px-4">Nomor Rekening</th>
              <th className="py-3.5 px-4 text-right">Saldo Sistem</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4">Transaksi Terakhir</th>
              <th className="py-3.5 px-4">Terakhir Update</th>
              <th className="py-3.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <div className="max-w-sm mx-auto space-y-2">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-700">Tidak ada rekening ditemukan</p>
                    <p className="text-xs text-slate-400">
                      Coba sesuaikan kata kunci pencarian atau tambahkan rekening baru.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAccounts.map((acc, index) => {
                const isUnmasked = unmaskedRows[acc.id] || false;
                const displayAccNo = isUnmasked ? acc.accountNumber : acc.accountNumberMasked;

                return (
                  <tr
                    key={acc.id}
                    id={`table-row-account-${acc.id}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-4 text-center text-slate-400 font-semibold">
                      {index + 1}
                    </td>

                    {/* Bank */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-[#005E6A] text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                          BNI
                        </div>
                        <span className="font-bold text-slate-800">{acc.bankName}</span>
                      </div>
                    </td>

                    {/* Nama Rekening */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">
                        {acc.accountName}
                      </div>
                      <div className="text-[11px] text-slate-500">{acc.atasNama}</div>
                    </td>

                    {/* Nomor Rekening */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-semibold text-slate-800 tracking-wider">
                          {displayAccNo}
                        </span>
                        <button
                          onClick={() => toggleRowMask(acc.id)}
                          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded"
                          title={isUnmasked ? 'Sensor nomor' : 'Buka sensor'}
                        >
                          {isUnmasked ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Saldo Sistem */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {formatRupiah(acc.saldo)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {acc.status}
                      </span>
                    </td>

                    {/* Transaksi Terakhir */}
                    <td className="py-4 px-4 max-w-[200px]">
                      <div className="truncate font-semibold text-slate-800">
                        {acc.lastTransactionDesc}
                      </div>
                      <div
                        className={`text-[11px] font-bold ${
                          acc.lastTransactionType === 'MASUK'
                            ? 'text-emerald-700'
                            : 'text-rose-600'
                        }`}
                      >
                        {acc.lastTransactionType === 'MASUK' ? '+' : '-'}
                        {formatRupiah(acc.lastTransactionAmount)}
                      </div>
                    </td>

                    {/* Terakhir Update */}
                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {acc.lastUpdated}
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          id={`btn-table-view-${acc.id}`}
                          onClick={() => onSelectAccountDetail(acc)}
                          title="Lihat Detail Rekening"
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          id={`btn-table-edit-${acc.id}`}
                          onClick={() => onEditAccount(acc)}
                          title="Edit Pengaturan Rekening"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          id={`btn-table-mutasi-${acc.id}`}
                          onClick={() => onSelectAccountMutation(acc)}
                          title="Lihat Mutasi Transaksi"
                          className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          id={`btn-table-transfer-${acc.id}`}
                          onClick={() => onOpenTransferModal(acc.id)}
                          title="Transfer dari rekening ini"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#064E3B] hover:bg-slate-100 transition-colors"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Note */}
      <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">
            Total {filteredAccounts.length} Rekening Terdaftar
          </span>
          <span>•</span>
          <span className="text-slate-500">
            Semua transaksi tercatat otomatis via Virtual Account BNI & Jurnal Kas Keluar.
          </span>
        </div>
        <div className="flex items-center gap-3 font-semibold text-emerald-800">
          <span>Formula: Saldo Awal + Masuk - Keluar = Saldo Sistem</span>
        </div>
      </div>
    </div>
  );
};
