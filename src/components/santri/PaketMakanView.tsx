import React, { useState } from 'react';
import {
  Utensils,
  Search,
  Download,
  Printer,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  DollarSign,
  Coffee,
  ChefHat,
  Filter,
} from 'lucide-react';
import { initialStudents, MEAL_PACKAGES_INFO } from '../../data/studentsData';
import { downloadExcelSpreadsheet, downloadPrintableReport } from '../../utils/fileDownloader';

interface PaketMakanViewProps {
  onNavigateToStudentDetail?: (nis: string) => void;
  onShowToast: (msg: string) => void;
}

export const PaketMakanView: React.FC<PaketMakanViewProps> = ({
  onNavigateToStudentDetail,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [selectedPackageFilter, setSelectedPackageFilter] = useState<'All' | 'Paket A' | 'Paket B' | 'Paket C'>('All');
  const [selectedUnit, setSelectedUnit] = useState<'All' | 'MTs' | 'MA'>('All');

  const countC = initialStudents.filter((s) => s.paketMakan === 'Paket C').length;
  const countB = initialStudents.filter((s) => s.paketMakan === 'Paket B').length;
  const countA = initialStudents.filter((s) => s.paketMakan === 'Paket A').length;
  const totalSantriCount = initialStudents.length;
  const pctC = totalSantriCount > 0 ? ((countC / totalSantriCount) * 100).toFixed(1) : '0';
  const pctB = totalSantriCount > 0 ? ((countB / totalSantriCount) * 100).toFixed(1) : '0';
  const pctA = totalSantriCount > 0 ? ((countA / totalSantriCount) * 100).toFixed(1) : '0';

  const filteredStudents = initialStudents.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      s.kelas.toLowerCase().includes(search.toLowerCase());
    const matchPackage =
      selectedPackageFilter === 'All' || s.paketMakan === selectedPackageFilter;
    const matchUnit = selectedUnit === 'All' || s.unit === selectedUnit;
    return matchSearch && matchPackage && matchUnit;
  });

  const handleExportKitchenRoster = () => {
    const headers = [
      'No',
      'NIS',
      'Nama Santri',
      'Unit',
      'Kelas',
      'Paket Konsumsi Dapur',
      'Tarif Konsumsi / Bulan',
      'Status SPP',
      'Wali Santri',
      'No. HP Wali',
    ];

    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      s.nis,
      s.nama,
      s.unit,
      s.kelas,
      s.paketMakan,
      MEAL_PACKAGES_INFO[s.paketMakan]?.priceFormatted || 'Rp0',
      s.totalTunggakan === 0 ? 'Lunas' : 'Menunggak',
      s.namaWali,
      s.noHpWali,
    ]);

    downloadExcelSpreadsheet(`Daftar_Paket_Makan_Santri_${new Date().toISOString().slice(0, 10)}.xls`, {
      title: 'DAFTAR ALOKASI KONSUMSI DAPUR SANTRI',
      subtitle: 'Pondok Modern Raudhatussalam Mahato • Biro Dapur & Konsumsi',
      headers,
      rows,
      summary: [
        { label: 'Total Santri Terfilter', value: `${filteredStudents.length} Orang` },
        { label: 'Paket C (Full Dapur)', value: `${filteredStudents.filter((x) => x.paketMakan === 'Paket C').length} Santri` },
        { label: 'Paket B (1x Siang)', value: `${filteredStudents.filter((x) => x.paketMakan === 'Paket B').length} Santri` },
        { label: 'Paket A (Mandiri/Rumah)', value: `${filteredStudents.filter((x) => x.paketMakan === 'Paket A').length} Santri` },
      ],
    });

    onShowToast('File rekapitulasi paket makan santri berhasil diunduh!');
  };

  const handlePrintKitchenSheet = () => {
    const filename = `Daftar_Konsumsi_Dapur_${new Date().toISOString().slice(0, 10)}.html`;
    const contentHtml = `
      <div class="kop-header">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="kop-logo">R</div>
          <div class="kop-text">
            <h1>Pondok Modern Raudhatussalam Mahato</h1>
            <p>Biro Logistik & Dapur Pesantren • Daftar Jatah Makan Santri Harian</p>
          </div>
        </div>
        <div style="text-align:right;">
          <span style="background:#fef3c7;color:#92400e;padding:4px 8px;border-radius:4px;font-weight:bold;font-size:9px;">REKAP DAPUR</span>
          <p style="margin-top:4px;font-size:9px;color:#64748b;">Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
        </div>
      </div>

      <h2 style="text-align:center;font-size:12px;text-transform:uppercase;">Alokasi Porsi Makan Santri Pesantren</h2>
      <p style="text-align:center;font-size:10px;color:#64748b;margin-top:2px;">
        Paket C (3x Sehari) • Paket B (1x Makan Siang) • Paket A (Mandiri Rumah)
      </p>

      <table>
        <thead>
          <tr>
            <th style="width:30px;">No</th>
            <th style="width:75px;">NIS</th>
            <th>Nama Lengkap Santri</th>
            <th>Kelas</th>
            <th>Paket Konsumsi</th>
            <th style="text-align:center;">Pagi</th>
            <th style="text-align:center;">Siang</th>
            <th style="text-align:center;">Malam</th>
          </tr>
        </thead>
        <tbody>
          ${filteredStudents
            .map(
              (s, idx) => `
            <tr>
              <td style="text-align:center;">${idx + 1}</td>
              <td>${s.nis}</td>
              <td><strong>${s.nama}</strong></td>
              <td>${s.kelas} (${s.unit})</td>
              <td><strong>${s.paketMakan}</strong></td>
              <td style="text-align:center;">${s.paketMakan === 'Paket C' ? '✓' : '-'}</td>
              <td style="text-align:center;">${s.paketMakan === 'Paket C' || s.paketMakan === 'Paket B' ? '✓' : '-'}</td>
              <td style="text-align:center;">${s.paketMakan === 'Paket C' ? '✓' : '-'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer-signatures" style="margin-top:35px;">
        <div class="signature-box">
          <p>Kepala Dapur & Gizi</p>
          <div class="signature-space"></div>
          <p style="text-decoration:underline;font-weight:bold;">Ust. Syamsul Bahri</p>
        </div>
        <div class="signature-box">
          <p>Bendahara Pesantren</p>
          <div class="signature-space"></div>
          <p style="text-decoration:underline;font-weight:bold;">Ust. Salman Al-Farisi</p>
        </div>
      </div>
    `;

    downloadPrintableReport(filename, 'Daftar Konsumsi Dapur', contentHtml);
    onShowToast('Lembar jatah konsumsi dapur siap dicetak!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-emerald-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none flex items-center justify-center">
          <Utensils className="w-64 h-64 transform -rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-400/30 text-[11px] font-semibold text-amber-200 mb-2.5">
              <ChefHat className="w-3.5 h-3.5" />
              Manajemen Logistik & Dapur Pesantren
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Paket Makan Dapur Santri
            </h1>
            <p className="text-xs md:text-sm text-amber-100/90 mt-1 max-w-2xl leading-relaxed">
              Monitoring alokasi porsi makan, kategori paket konsumsi santri, serta integrasi tarif konsumsi bulanan ke sistem penagihan SPP.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintKitchenSheet}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Jatah Dapur
            </button>
            <button
              type="button"
              onClick={handleExportKitchenRoster}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" /> Ekspor Excel
            </button>
          </div>
        </div>
      </div>

      {/* Package Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#064E3B]">
              Paket C (Full Dapur)
            </span>
            <span className="text-sm font-bold text-slate-900">Rp 600.000 / bln</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Full Makan di Pesantren</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            3x makan harian lengkap (sarapan, makan siang, dan makan malam) standar gizi dapur santri.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Santri Terdaftar:</span>
            <span className="font-bold text-emerald-800">{countC} Santri ({pctC}%)</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-amber-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              Paket B (Makan Siang)
            </span>
            <span className="text-sm font-bold text-slate-900">Rp 200.000 / bln</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">1x Makan Siang Pesantren</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Santri mendapatkan makan siang di pesantren saat jam istirahat, sarapan & makan malam di rumah.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Santri Terdaftar:</span>
            <span className="font-bold text-amber-800">{countB} Santri ({pctB}%)</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              Paket A (Mandiri)
            </span>
            <span className="text-sm font-bold text-slate-900">Rp 0 / bln</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Full Mandiri di Luar/Rumah</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Santri tinggal bersama orang tua di desa sekitar dan membawa bekal / makan di rumah secara mandiri.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Santri Terdaftar:</span>
            <span className="font-bold text-slate-700">{countA} Santri ({pctA}%)</span>
          </div>
        </div>
      </div>

      {/* Roster Filter & Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari santri, NIS, atau kelas..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Filter Paket:</span>
            {(['All', 'Paket C', 'Paket B', 'Paket A'] as const).map((pkg) => (
              <button
                key={pkg}
                type="button"
                onClick={() => setSelectedPackageFilter(pkg)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  selectedPackageFilter === pkg
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {pkg === 'All' ? 'Semua Paket' : pkg}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">No</th>
                <th className="py-2.5 px-3">NIS & Nama Santri</th>
                <th className="py-2.5 px-3">Kelas & Unit</th>
                <th className="py-2.5 px-3">Paket Makan</th>
                <th className="py-2.5 px-3">Biaya Konsumsi</th>
                <th className="py-2.5 px-3">Status SPP</th>
                <th className="py-2.5 px-3">Wali Santri</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data santri yang cocok.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{s.nama}</div>
                      <div className="text-[11px] text-slate-400 font-mono">NIS: {s.nis}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-800">{s.kelas}</span>
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {s.unit}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                          s.paketMakan === 'Paket C'
                            ? 'bg-emerald-50 text-[#064E3B] border-emerald-200'
                            : s.paketMakan === 'Paket B'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {s.paketMakan}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {MEAL_PACKAGES_INFO[s.paketMakan]?.priceFormatted || 'Rp0'}
                    </td>
                    <td className="py-2.5 px-3">
                      {s.totalTunggakan === 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Lunas
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          Tunggakan
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-slate-800 font-medium">{s.namaWali}</div>
                      <div className="text-[11px] text-slate-400">{s.noHpWali}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
