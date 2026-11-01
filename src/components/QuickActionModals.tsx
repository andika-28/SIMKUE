import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  MinusCircle,
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building,
  FileCheck,
  Download,
  CreditCard,
} from 'lucide-react';
import { Transaction } from '../types';
import { downloadCsv } from '../utils/fileDownloader';

interface QuickActionModalsProps {
  modalType: 'pemasukan' | 'pengeluaran' | 'tagihan' | 'import' | null;
  onClose: () => void;
  onAddTransaction: (trx: Omit<Transaction, 'id'>) => void;
  onSuccessToast: (message: string) => void;
}

export const QuickActionModals: React.FC<QuickActionModalsProps> = ({
  modalType,
  onClose,
  onAddTransaction,
  onSuccessToast,
}) => {
  if (!modalType) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[70] animate-in fade-in duration-150">
      {modalType === 'pemasukan' && (
        <TambahPemasukanForm
          onClose={onClose}
          onAddTransaction={onAddTransaction}
          onSuccessToast={onSuccessToast}
        />
      )}

      {modalType === 'pengeluaran' && (
        <CatatPengeluaranForm
          onClose={onClose}
          onAddTransaction={onAddTransaction}
          onSuccessToast={onSuccessToast}
        />
      )}

      {modalType === 'tagihan' && (
        <GenerateTagihanForm
          onClose={onClose}
          onSuccessToast={onSuccessToast}
        />
      )}

      {modalType === 'import' && (
        <ImportPembayaranForm
          onClose={onClose}
          onSuccessToast={onSuccessToast}
        />
      )}
    </div>
  );
};

/* --- 1. Tambah Pemasukan Form --- */
const TambahPemasukanForm: React.FC<{
  onClose: () => void;
  onAddTransaction: (trx: Omit<Transaction, 'id'>) => void;
  onSuccessToast: (msg: string) => void;
}> = ({ onClose, onAddTransaction, onSuccessToast }) => {
  const [kategori, setKategori] = useState('SPP');
  const [nominal, setNominal] = useState('');
  const [rekening, setRekening] = useState('BNI Operasional');
  const [keterangan, setKeterangan] = useState('');
  const [santri, setSantri] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNominal = parseInt(nominal.replace(/\D/g, ''), 10);
    if (!cleanNominal || cleanNominal <= 0) {
      alert('Mohon masukkan nominal yang valid.');
      return;
    }

    onAddTransaction({
      tanggal: '31 Agu 2026',
      keterangan: keterangan || `Pembayaran ${kategori} Santri`,
      kategori,
      jenis: 'Pemasukan',
      nominal: cleanNominal,
      status: 'Berhasil',
      rekening,
      santri: santri || undefined,
    });

    onSuccessToast(`Pemasukan Rp ${cleanNominal.toLocaleString('id-ID')} berhasil dicatat.`);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-100">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E293B]">
              Tambah Pemasukan Kas
            </h3>
            <p className="text-xs text-[#64748B]">
              Input penerimaan SPP, Uang Makan, Infaq, atau donasi
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        <div>
          <label className="block font-bold text-[#334155] mb-1">
            Kategori Pemasukan
          </label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B] outline-none"
          >
            <option value="SPP">SPP Bulanan Santri</option>
            <option value="Uang Makan">Uang Makan / Konsumsi</option>
            <option value="Listrik & Air">Iuran Listrik & Air</option>
            <option value="Infaq / Donasi">Infaq / Wakaf / Donasi</option>
            <option value="Pendaftaran">Biaya Pendaftaran Santri Baru</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-[#334155] mb-1">
              Nominal (Rp)
            </label>
            <input
              type="number"
              placeholder="Contoh: 1500000"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              required
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs font-semibold text-[#1E293B] focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1">
              Rekening Tujuan
            </label>
            <select
              value={rekening}
              onChange={(e) => setRekening(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B] outline-none"
            >
              <option value="BNI Operasional">BNI Rek. Operasional (8821)</option>
              <option value="BNI Utama">BNI Rek. Utama (4092)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#334155] mb-1">
            Keterangan / Uraian
          </label>
          <input
            type="text"
            placeholder="Contoh: Pembayaran SPP Bulan Agustus a.n Santri"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B] outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-[#334155] mb-1">
            Data Santri / Penyetor (Opsional)
          </label>
          <input
            type="text"
            placeholder="Contoh: Ahmad Fauzi (Kelas 1)"
            value={santri}
            onChange={(e) => setSantri(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B] outline-none"
          />
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-emerald-900 rounded-lg shadow-xs transition"
          >
            Simpan Pemasukan
          </button>
        </div>
      </form>
    </div>
  );
};

/* --- 2. Catat Pengeluaran Form --- */
const CatatPengeluaranForm: React.FC<{
  onClose: () => void;
  onAddTransaction: (trx: Omit<Transaction, 'id'>) => void;
  onSuccessToast: (msg: string) => void;
}> = ({ onClose, onAddTransaction, onSuccessToast }) => {
  const [kategori, setKategori] = useState('Belanja Dapur');
  const [nominal, setNominal] = useState('');
  const [rekening, setRekening] = useState('BNI Operasional');
  const [keterangan, setKeterangan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNominal = parseInt(nominal.replace(/\D/g, ''), 10);
    if (!cleanNominal || cleanNominal <= 0) {
      alert('Mohon masukkan nominal yang valid.');
      return;
    }

    onAddTransaction({
      tanggal: '31 Agu 2026',
      keterangan: keterangan || `Pengeluaran ${kategori}`,
      kategori,
      jenis: 'Pengeluaran',
      nominal: cleanNominal,
      status: 'Berhasil',
      rekening,
    });

    onSuccessToast(`Pengeluaran Rp ${cleanNominal.toLocaleString('id-ID')} berhasil dibukukan.`);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#1E293B] text-white flex items-center justify-center">
            <MinusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E293B]">
              Catat Pengeluaran Kas
            </h3>
            <p className="text-xs text-[#64748B]">
              Pembukuan belanja dapur, gaji ustadz/guru, atau operasional
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        <div>
          <label className="block font-bold text-[#334155] mb-1">
            Pos Kategori Pengeluaran
          </label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] focus:ring-2 focus:ring-slate-500/20 focus:border-[#1E293B] outline-none"
          >
            <option value="Belanja Dapur">Belanja Bahan Dapur & Konsumsi</option>
            <option value="Gaji Guru">Gaji & Honor Ustadz/Guru</option>
            <option value="Perawatan Pembangunan">Perawatan Sarana & Pembangunan</option>
            <option value="Kegiatan Santri">Kegiatan Ekstrakurikuler & Halaqoh</option>
            <option value="Internet & Utilitas">Internet, Listrik & Utilitas</option>
            <option value="Operasional Kantor">Operasional Kantor & Kesekretariatan</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-[#334155] mb-1">
              Nominal (Rp)
            </label>
            <input
              type="number"
              placeholder="Contoh: 2500000"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              required
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs font-semibold text-[#1E293B] focus:ring-2 focus:ring-slate-500/20 focus:border-[#1E293B] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1">
              Debet Dari Rekening
            </label>
            <select
              value={rekening}
              onChange={(e) => setRekening(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] focus:ring-2 focus:ring-slate-500/20 focus:border-[#1E293B] outline-none"
            >
              <option value="BNI Operasional">BNI Rek. Operasional (8821)</option>
              <option value="BNI Utama">BNI Rek. Utama (4092)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#334155] mb-1">
            Uraian Pengeluaran / Penerima
          </label>
          <input
            type="text"
            placeholder="Contoh: Pembelian beras 500kg & lauk pauk dapur umum"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            required
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] focus:ring-2 focus:ring-slate-500/20 focus:border-[#1E293B] outline-none"
          />
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1E293B] hover:bg-slate-900 rounded-lg shadow-xs transition"
          >
            Simpan Pengeluaran
          </button>
        </div>
      </form>
    </div>
  );
};

/* --- 3. Generate Tagihan Form --- */
const GenerateTagihanForm: React.FC<{
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}> = ({ onClose, onSuccessToast }) => {
  const [bulan, setBulan] = useState('September 2026');
  const [targetKelas, setTargetKelas] = useState('Semua Kelas');
  const [sppAmount, setSppAmount] = useState('500000');
  const [makanAmount, setMakanAmount] = useState('750000');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccessToast(`Berhasil men-generate tagihan ${bulan} untuk ${targetKelas}. Virtual Account diperbarui.`);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E293B]">
              Generate Tagihan Santri
            </h3>
            <p className="text-xs text-[#64748B]">
              Otomatisasi pembuatan tagihan SPP & Uang Makan berkala
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleGenerate} className="mt-5 space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-[#334155] mb-1">
              Periode Bulan
            </label>
            <select
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] outline-none"
            >
              <option value="September 2026">September 2026</option>
              <option value="Oktober 2026">Oktober 2026</option>
              <option value="November 2026">November 2026</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1">
              Target Kelas
            </label>
            <select
              value={targetKelas}
              onChange={(e) => setTargetKelas(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] outline-none"
            >
              <option value="Semua Kelas">Semua Kelas (Kelas 1 - 6)</option>
              <option value="Kelas 1">Kelas 1 Saja</option>
              <option value="Kelas 2">Kelas 2 Saja</option>
              <option value="Kelas 3">Kelas 3 Saja</option>
            </select>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
          <p className="font-bold text-[#1E293B]">Komponen Tagihan Standar:</p>
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">SPP Bulanan:</span>
            <span className="font-bold text-[#1E293B]">Rp 500.000 / santri</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Uang Makan / Konsumsi:</span>
            <span className="font-bold text-[#1E293B]">Rp 750.000 / santri</span>
          </div>
          <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between font-bold">
            <span className="text-[#064E3B]">Total Per Santri:</span>
            <span className="text-[#064E3B] text-sm">Rp 1.250.000</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-emerald-900 rounded-lg shadow-xs transition"
          >
            Proses Generate
          </button>
        </div>
      </form>
    </div>
  );
};

/* --- 4. Import Pembayaran Form --- */
const ImportPembayaranForm: React.FC<{
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}> = ({ onClose, onSuccessToast }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccessToast(`File '${fileName || 'mutasi_bni_agustus.xlsx'}' berhasil diimport! 18 transaksi terverifikasi.`);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E293B]">
              Import Data Pembayaran
            </h3>
            <p className="text-xs text-[#64748B]">
              Unggah file Excel / CSV rekonsiliasi bank atau VA BNI
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleUpload} className="mt-5 space-y-4 text-xs">
        <div className="border-2 border-dashed border-[#CBD5E1] hover:border-[#064E3B] rounded-xl p-6 text-center bg-[#F8FAFC] transition cursor-pointer">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFileName(e.target.files[0].name);
              }
            }}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <UploadCloud className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
            <p className="font-bold text-[#1E293B]">
              {fileName ? fileName : 'Klik untuk memilih file atau seret file ke sini'}
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Mendukung format .xlsx, .xls, .csv (Maks. 10MB)
            </p>
          </label>
        </div>

        <div className="flex items-center justify-between bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] text-[11px] text-[#64748B]">
          <span>Format Template BNI Virtual Account:</span>
          <button
            type="button"
            onClick={() => {
              const headers = ['No_Virtual_Account', 'NIS', 'Nama_Santri', 'Tanggal_Bayar', 'Nominal', 'Kode_Channel', 'Keterangan'];
              const rows = [
                ['9881234567890001', '202601001', 'Muhammad Fatih Al-Ayyubi', '2026-08-30 09:15:00', 850000, 'ATM_BNI', 'Tagihan SPP & Uang Makan Agustus 2026'],
                ['9881234567890002', '202601002', 'Aisyah Putri Rahmadani', '2026-08-30 10:20:11', 850000, 'MOBILE_BANKING', 'Tagihan SPP & Uang Makan Agustus 2026'],
                ['9881234567890003', '202601003', 'Ahmad Farhan Kamil', '2026-08-30 11:05:42', 850000, 'TELLER', 'Tagihan SPP & Uang Makan Agustus 2026'],
              ];
              downloadCsv('template_import_pembayaran_simkeu.csv', headers, rows);
              onSuccessToast('Template import pembayaran berhasil diunduh.');
            }}
            className="text-[#064E3B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3" /> Unduh Template
          </button>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-emerald-900 rounded-lg shadow-xs transition"
          >
            Mulai Import Data
          </button>
        </div>
      </form>
    </div>
  );
};
