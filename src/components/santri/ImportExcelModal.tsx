import React, { useState } from 'react';
import { X, UploadCloud, Download, CheckCircle2, AlertTriangle, XCircle, FileSpreadsheet, Check } from 'lucide-react';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmImport: (count: number) => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onConfirmImport,
}) => {
  const [fileName, setFileName] = useState<string | null>('Data_Induk_Santri_2026_2027.xlsx');
  const [isUploaded, setIsUploaded] = useState(true);

  if (!isOpen) return null;

  const previewRows = [
    { nis: '2026016', nama: 'Ilyas Pratama', jk: 'Laki-laki', kelas: 'Kelas 1', wali: 'Pratama Jaya', hp: '0812-3344-7788', alamat: 'Mahato KM 26', status: 'Aktif', paket: 'Paket C' },
    { nis: '2026017', nama: 'Hafizhah Humaira', jk: 'Perempuan', kelas: 'Kelas 1', wali: 'Drs. H. Arifin', hp: '0813-5566-7788', alamat: 'Dalu-Dalu Kota', status: 'Aktif', paket: 'Paket C' },
    { nis: '2025018', nama: 'Salman Al-Farisi', jk: 'Laki-laki', kelas: 'Kelas 2', wali: 'Farisi Rahman', hp: '0822-1122-3344', alamat: 'Tambusai Utara', status: 'Aktif', paket: 'Paket B' },
    { nis: '2024019', nama: 'Aisyah Putri', jk: 'Perempuan', kelas: 'Kelas 3', wali: 'Putra Siregar', hp: '0852-7788-9911', alamat: 'Pasir Pengaraian', status: 'Aktif', paket: 'Paket A' },
  ];

  const handleDownloadTemplate = () => {
    // Generate CSV template
    const headers = 'NIS,Nama Santri,Jenis Kelamin,Kelas,Nama Wali,No HP Wali,Alamat,Status,Paket Makan\n';
    const sample = '2026001,Muhammad Rizky,Laki-laki,Kelas 1,Ahmad Fauzi,081234567890,Mahato KM 24,Aktif,Paket C\n';
    const blob = new Blob([headers + sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Template_Import_Santri_SIMKEU.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProcessImport = () => {
    onConfirmImport(295);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full p-6 shadow-2xl border border-[#E2E8F0] my-8 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E293B]">
                Import Data Santri dari Excel
              </h3>
              <p className="text-xs text-[#64748B]">
                Unggah berkas data induk santri format Microsoft Excel (.xlsx, .xls)
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

        <div className="mt-5 space-y-5 text-xs">
          {/* Upload Box */}
          <div className="border-2 border-dashed border-[#CBD5E1] hover:border-[#064E3B] rounded-xl p-6 text-center bg-[#F8FAFC] transition">
            <input
              type="file"
              id="excel-file-upload"
              className="hidden"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFileName(e.target.files[0].name);
                  setIsUploaded(true);
                }
              }}
            />
            <label htmlFor="excel-file-upload" className="cursor-pointer">
              <FileSpreadsheet className="w-9 h-9 text-[#064E3B] mx-auto mb-2" />
              <p className="font-bold text-sm text-[#1E293B]">
                {fileName ? fileName : 'Drag & drop file Excel di sini atau Pilih File'}
              </p>
              <p className="text-[11px] text-[#64748B] mt-1">
                Mendukung format .xlsx, .xls (Maksimal 10MB)
              </p>
            </label>
          </div>

          {/* Download Template Bar */}
          <div className="flex items-center justify-between bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 text-[11px] text-[#064E3B]">
            <span className="font-medium">
              Gunakan format kolom resmi pesantren untuk menghindari kesalahan validasi:
            </span>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="text-[#064E3B] font-bold hover:underline flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Template Excel
            </button>
          </div>

          {/* Validation Summary Card */}
          {isUploaded && (
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E293B]">Hasil Analisis & Validasi Berkas:</span>
                <span className="text-[11px] text-[#64748B]">Total 300 Baris Data Terbaca</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Valid */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#064E3B]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold">295 Data Valid</p>
                    <p className="text-[10px] text-emerald-700">Siap diimpor ke sistem</p>
                  </div>
                </div>

                {/* Duplikat */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold">3 Data Duplikat</p>
                    <p className="text-[10px] text-amber-700">NIS sudah terdaftar (dilewati)</p>
                  </div>
                </div>

                {/* Tidak Lengkap */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900">
                  <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold">2 Tidak Lengkap</p>
                    <p className="text-[10px] text-red-700">Kolom nama/kelas kosong</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {isUploaded && (
            <div>
              <p className="font-bold text-[#1E293B] mb-2">Pratinjau Data (Contoh 4 Baris Teratas):</p>
              <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#F1F5F9] text-[#64748B] font-bold uppercase tracking-wider">
                    <tr className="border-b border-[#E2E8F0]">
                      <th className="p-2">NIS</th>
                      <th className="p-2">Nama</th>
                      <th className="p-2">Jenis Kelamin</th>
                      <th className="p-2">Kelas</th>
                      <th className="p-2">Nama Wali</th>
                      <th className="p-2">No HP</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Paket Makan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
                    {previewRows.map((r) => (
                      <tr key={r.nis} className="hover:bg-[#F8FAFC]">
                        <td className="p-2 font-mono font-bold text-[#064E3B]">{r.nis}</td>
                        <td className="p-2 font-semibold text-[#1E293B]">{r.nama}</td>
                        <td className="p-2 text-[#64748B]">{r.jk}</td>
                        <td className="p-2">{r.kelas}</td>
                        <td className="p-2">{r.wali}</td>
                        <td className="p-2 font-mono">{r.hp}</td>
                        <td className="p-2">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[#064E3B] font-bold text-[10px]">
                            {r.status}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {r.paket}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleProcessImport}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-emerald-900 rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Import 295 Data Valid</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
