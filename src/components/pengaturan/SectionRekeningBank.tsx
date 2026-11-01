import React from 'react';
import {
  Building,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Wallet,
} from 'lucide-react';

interface SectionRekeningBankProps {
  onNavigateToBankModule?: () => void;
  onShowToast: (msg: string) => void;
}

export const SectionRekeningBank: React.FC<SectionRekeningBankProps> = ({
  onNavigateToBankModule,
  onShowToast,
}) => {
  const bankAccounts = [
    {
      id: 'acc-1',
      bankName: 'Bank Negara Indonesia (BNI)',
      accountName: 'PM RAUDHATUSSALAM OPERASIONAL',
      accountNumber: '1234567890',
      type: 'Rekening Operasional Harian & SPP',
      balance: 318420000,
      status: 'Aktif',
      isPrimary: true,
    },
    {
      id: 'acc-2',
      bankName: 'Bank Negara Indonesia (BNI)',
      accountName: 'PM RAUDHATUSSALAM UTAMA',
      accountNumber: '0987654321',
      type: 'Rekening Penampungan Pembangunan & Aset',
      balance: 524230000,
      status: 'Aktif',
      isPrimary: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Konfigurasi Rekening Bank Pesantren</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar rekening bank resmi lembaga untuk tujuan pembayaran transfer wali santri dan mutasi pengeluaran.
          </p>
        </div>
        {onNavigateToBankModule && (
          <button
            type="button"
            id="btn-buka-modul-bank"
            onClick={onNavigateToBankModule}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all shrink-0"
          >
            Buka Modul Rekening Bank
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bankAccounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 font-black text-xs flex items-center justify-center border border-orange-200">
                    BNI
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{acc.bankName}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{acc.type}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {acc.status}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Nomor Rekening
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                    {acc.accountNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Atas Nama Rekening
                  </span>
                  <span className="font-bold text-slate-800">{acc.accountName}</span>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-baseline justify-between">
                  <span className="text-slate-500">Saldo Buku Saat Ini:</span>
                  <span className="font-black text-emerald-800 text-sm">
                    Rp {acc.balance.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Terverifikasi Rekonsiliasi
              </span>
              {onNavigateToBankModule && (
                <button
                  type="button"
                  onClick={onNavigateToBankModule}
                  className="text-emerald-800 hover:text-emerald-900 font-bold inline-flex items-center gap-1 text-[11px]"
                >
                  Lihat Mutasi
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-600 space-y-1 leading-relaxed">
        <p className="font-bold text-slate-800">
          Sinkronisasi Pembayaran & Import Bank:
        </p>
        <p>
          Nomor rekening di atas ditampilkan secara otomatis pada kwitansi penagihan wali santri dan lembar surat edaran. Mutasi rekening dapat diimpor langsung melalui menu <strong>Import Pembayaran</strong> untuk pencocokan otomatis dengan tagihan santri.
        </p>
      </div>
    </div>
  );
};
