import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Home,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  Wallet,
  Phone,
  MessageSquare,
  Copy,
  Download,
} from 'lucide-react';
import {
  StudentArrearItem,
  ArrearsKPIStats,
  ArrearsFilterState,
  ArrearsCategory,
} from '../../types';
import { initialArrearsKPI, initialStudentArrears } from '../../data/arrearsData';
import { ArrearsSummaryCards } from './ArrearsSummaryCards';
import { ArrearsAlertPanel } from './ArrearsAlertPanel';
import { ArrearsPriorityCard } from './ArrearsPriorityCard';
import { ArrearsFilterToolbar } from './ArrearsFilterToolbar';
import { ArrearsTable } from './ArrearsTable';
import { ArrearsDetailDrawer } from './ArrearsDetailDrawer';
import { ArrearsAnalyticsSection } from './ArrearsAnalyticsSection';
import { ArrearsAgingAndTrend } from './ArrearsAgingAndTrend';
import { ArrearsExportReportModal } from './ArrearsExportReportModal';
import { ArrearsInvoicePrintModal } from './ArrearsInvoicePrintModal';
import { downloadExcelSpreadsheet, downloadPrintableReport } from '../../utils/fileDownloader';

interface TunggakanSantriViewProps {
  onNavigateToStudentDetail?: (studentId: string) => void;
}

export const TunggakanSantriView: React.FC<TunggakanSantriViewProps> = ({
  onNavigateToStudentDetail,
}) => {
  // Master state
  const [kpiData] = useState<ArrearsKPIStats>(initialArrearsKPI);
  const [arrearsList] = useState<StudentArrearItem[]>(initialStudentArrears);

  // Filter State
  const [filter, setFilter] = useState<ArrearsFilterState>({
    search: '',
    unit: 'Semua Unit',
    kelas: 'Semua Kelas',
    jenisTunggakan: 'Semua Jenis',
    filterBulan: 'Semua Bulan',
    filterItemTahunan: 'Semua Item Tahunan',
    kategoriTunggakan: 'Semua Kategori',
    nominalTunggakan: 'Semua Nominal',
    statusSantri: 'Aktif',
    priorityFilter: 'Semua',
    sortBy: 'totalDesc',
  });

  // Drawer & Modal State
  const [selectedStudent, setSelectedStudent] = useState<StudentArrearItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [selectedArrearForPrint, setSelectedArrearForPrint] = useState<StudentArrearItem | null>(null);
  const [isArrearPrintModalOpen, setIsArrearPrintModalOpen] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleUpdateFilter = (updates: Partial<ArrearsFilterState>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilter = () => {
    setFilter({
      search: '',
      unit: 'Semua Unit',
      kelas: 'Semua Kelas',
      jenisTunggakan: 'Semua Jenis',
      filterBulan: 'Semua Bulan',
      filterItemTahunan: 'Semua Item Tahunan',
      kategoriTunggakan: 'Semua Kategori',
      nominalTunggakan: 'Semua Nominal',
      statusSantri: 'Aktif',
      priorityFilter: 'Semua',
      sortBy: 'totalDesc',
    });
    showToast('Filter telah di-reset ke pengaturan awal');
  };

  // Filter and sort calculation
  const filteredArrears = useMemo(() => {
    return arrearsList
      .filter((item) => {
        // Search
        if (filter.search && filter.search.trim() !== '') {
          const q = filter.search.toLowerCase();
          const matchName = (item.namaSantri || '').toLowerCase().includes(q);
          const matchNis = (item.nis || '').toLowerCase().includes(q);
          const matchWali = (item.namaWali || '').toLowerCase().includes(q);
          if (!matchName && !matchNis && !matchWali) return false;
        }

        // Unit
        if (filter.unit !== 'Semua Unit' && item.unit !== filter.unit) {
          return false;
        }

        // Kelas
        if (filter.kelas !== 'Semua Kelas' && item.kelas !== filter.kelas) {
          return false;
        }

        // Jenis Tunggakan
        if (filter.jenisTunggakan === 'Bulanan Saja' || filter.jenisTunggakan === 'Tagihan Bulanan') {
          if (item.tunggakanBulanan <= 0) return false;
        } else if (filter.jenisTunggakan === 'Tahunan Saja' || filter.jenisTunggakan === 'Tagihan Tahunan') {
          if (item.tunggakanTahunan <= 0) return false;
        } else if (filter.jenisTunggakan === 'Keduanya') {
          if (item.tunggakanBulanan <= 0 || item.tunggakanTahunan <= 0) return false;
        }

        // Filter Spesifik Bulan (Bulanan)
        if (filter.filterBulan && filter.filterBulan !== 'Semua Bulan') {
          const targetMonth = filter.filterBulan.trim().toLowerCase();
          const hasUnpaidMonth =
            item.rincianBulanan?.some(
              (m) => m.periode.toLowerCase() === targetMonth && m.status === 'BELUM LUNAS'
            ) ||
            (item.periodeTerlama && item.periodeTerlama.toLowerCase() === targetMonth);
          if (!hasUnpaidMonth) return false;
        }

        // Filter Spesifik Item Tahunan (Per Item)
        if (
          filter.filterItemTahunan &&
          filter.filterItemTahunan !== 'Semua Item Tahunan' &&
          filter.filterItemTahunan !== 'Semua Item'
        ) {
          const key = filter.filterItemTahunan.toLowerCase();
          if (key.includes('pembangunan')) {
            if ((item.rincianTahunan?.pembangunan?.sisa || 0) <= 0) return false;
          } else if (key.includes('kertas')) {
            if ((item.rincianTahunan?.kertas?.sisa || 0) <= 0) return false;
          } else if (key.includes('kegiatan')) {
            if ((item.rincianTahunan?.kegiatan?.sisa || 0) <= 0) return false;
          }
        }

        // Kategori Usia
        if (
          filter.kategoriTunggakan !== 'Semua Kategori' &&
          item.kategori !== filter.kategoriTunggakan
        ) {
          return false;
        }

        // Nominal
        if (filter.nominalTunggakan === '< Rp500.000') {
          if (item.totalTunggakan >= 500000) return false;
        } else if (filter.nominalTunggakan === 'Rp500.000 – Rp1.000.000') {
          if (item.totalTunggakan < 500000 || item.totalTunggakan > 1000000) return false;
        } else if (filter.nominalTunggakan === 'Rp1.000.000 – Rp3.000.000') {
          if (item.totalTunggakan < 1000000 || item.totalTunggakan > 3000000) return false;
        } else if (filter.nominalTunggakan === '> Rp3.000.000') {
          if (item.totalTunggakan <= 3000000) return false;
        }

        // Status Santri
        if (filter.statusSantri !== 'Semua' && item.statusSantri !== filter.statusSantri) {
          return false;
        }

        // Priority Filter
        if (filter.priorityFilter !== 'Semua' && item.priority !== filter.priorityFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'totalDesc') return b.totalTunggakan - a.totalTunggakan;
        if (filter.sortBy === 'totalAsc') return a.totalTunggakan - b.totalTunggakan;
        if (filter.sortBy === 'bulananDesc') return b.tunggakanBulanan - a.tunggakanBulanan;
        if (filter.sortBy === 'tahunanDesc') return b.tunggakanTahunan - a.tunggakanTahunan;
        if (filter.sortBy === 'periodeAsc') return b.usiaTunggakanHari - a.usiaTunggakanHari;
        if (filter.sortBy === 'namaAsc') return a.namaSantri.localeCompare(b.namaSantri);
        return 0;
      });
  }, [arrearsList, filter]);

  // Handlers
  const handleOpenDetail = (item: StudentArrearItem) => {
    setSelectedStudent(item);
    setIsDrawerOpen(true);
  };

  const handleSelectStudentByNis = (nis: string) => {
    const found = arrearsList.find((s) => s.nis === nis);
    if (found) {
      setSelectedStudent(found);
      setIsDrawerOpen(true);
    }
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    showToast(`Nomor WhatsApp ${phone} berhasil disalin ke clipboard`);
  };

  const handleSendWhatsapp = (item: StudentArrearItem) => {
    const formatRp = (n: number) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(n).replace('IDR', 'Rp');

    const cleanPhone = item.noHpWali.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

    const message = encodeURIComponent(
      `Assalamu'alaikum Wr. Wb. Yth. Bapak/Ibu Wali Santri dari *${item.namaSantri}* (NIS: ${item.nis}, Kelas: ${item.kelas} ${item.unit}).\n\n` +
      `Bagian Keuangan PM. Raudhatussalam Mahato menginformasikan perihal tagihan pendidikan yang belum diselesaikan:\n` +
      `- Tunggakan Bulanan: *${formatRp(item.tunggakanBulanan)}*\n` +
      `- Sisa Tagihan Tahunan: *${formatRp(item.tunggakanTahunan)}*\n` +
      `--------------------------------\n` +
      `*TOTAL TUNGGAKAN: ${formatRp(item.totalTunggakan)}*\n\n` +
      `Mohon melakukan konfirmasi atau pelunasan ke rekening resmi pesantren. Terima kasih atas perhatian dan kerjasamanya.\nWassalamu'alaikum Wr. Wb.\n_SIMKEU PM. Raudhatussalam Mahato_`
    );

    window.open(`https://wa.me/${waPhone}?text=${message}`, '_blank');
    showToast(`Membuka WhatsApp untuk ${item.namaSantri}`);
  };

  const handleQuickExportExcel = () => {
    const isBulanan = filter.jenisTunggakan === 'Bulanan Saja' || (filter.filterBulan && filter.filterBulan !== 'Semua Bulan');
    const isPerItemTahunan =
      filter.filterItemTahunan &&
      filter.filterItemTahunan !== 'Semua Item Tahunan' &&
      filter.filterItemTahunan !== 'Semua Item';
    const isTahunan = filter.jenisTunggakan === 'Tahunan Saja' || isPerItemTahunan;

    let title = 'REKAPITULASI TUNGGAKAN BIAYA PENDIDIKAN SANTRI';
    let subtitle = `Tahun Ajaran 2026/2027 • Tanggal: ${new Date().toLocaleDateString('id-ID')}`;
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (isPerItemTahunan) {
      const itemKey = filter.filterItemTahunan!.toLowerCase();
      const itemLabel = itemKey.includes('pembangunan')
        ? 'Uang Pembangunan'
        : itemKey.includes('kertas')
        ? 'Uang Kertas & Ujian'
        : 'Uang Kegiatan';

      title = `REKAPITULASI TUNGGAKAN IURAN TAHUNAN - ${itemLabel.toUpperCase()}`;
      subtitle = `Komponen Khusus: ${itemLabel} • Unit: ${filter.unit} • Kelas: ${filter.kelas}`;
      headers = [
        'No',
        'NIS',
        'Nama Santri',
        'Kelas',
        'Unit',
        'Kewajiban Tagihan',
        'Sudah Dibayar',
        `Sisa ${itemLabel}`,
        'Status Pelunasan',
        'Nama Wali',
        'No. HP Wali',
      ];
      rows = filteredArrears.map((item, idx) => {
        const detail = itemKey.includes('pembangunan')
          ? item.rincianTahunan?.pembangunan
          : itemKey.includes('kertas')
          ? item.rincianTahunan?.kertas
          : item.rincianTahunan?.kegiatan;
        const totalWajib = detail?.nominal || 0;
        const sisa = detail?.sisa || 0;
        const dibayar = detail?.terbayar || Math.max(0, totalWajib - sisa);
        const status = sisa <= 0 ? 'Lunas' : dibayar > 0 ? 'Cicilan' : 'Belum Bayar';

        return [
          idx + 1,
          item.nis,
          item.namaSantri,
          item.kelas,
          item.unit,
          `Rp ${totalWajib.toLocaleString('id-ID')}`,
          `Rp ${dibayar.toLocaleString('id-ID')}`,
          `Rp ${sisa.toLocaleString('id-ID')}`,
          status,
          item.namaWali,
          item.noHpWali,
        ];
      });
    } else if (isTahunan) {
      title = 'REKAPITULASI TUNGGAKAN IURAN TAHUNAN SANTRI (RINCIAN PER ITEM)';
      subtitle = `Pos Tagihan: Pembangunan, Uang Kertas & Ujian, Kegiatan Santri • Unit: ${filter.unit}`;
      headers = [
        'No',
        'NIS',
        'Nama Santri',
        'Kelas',
        'Unit',
        'Sisa Uang Pembangunan',
        'Sisa Uang Kertas & Ujian',
        'Sisa Uang Kegiatan',
        'Total Tunggakan Tahunan',
        'Nama Wali',
        'No. HP Wali',
      ];
      rows = filteredArrears.map((item, idx) => [
        idx + 1,
        item.nis,
        item.namaSantri,
        item.kelas,
        item.unit,
        `Rp ${(item.rincianTahunan?.pembangunan?.sisa || 0).toLocaleString('id-ID')}`,
        `Rp ${(item.rincianTahunan?.kertas?.sisa || 0).toLocaleString('id-ID')}`,
        `Rp ${(item.rincianTahunan?.kegiatan?.sisa || 0).toLocaleString('id-ID')}`,
        `Rp ${item.tunggakanTahunan.toLocaleString('id-ID')}`,
        item.namaWali,
        item.noHpWali,
      ]);
    } else if (isBulanan) {
      const bulanLabel = filter.filterBulan && filter.filterBulan !== 'Semua Bulan' ? filter.filterBulan : 'Semua Bulan Menunggak';
      title = `REKAPITULASI TUNGGAKAN BULANAN SANTRI (${bulanLabel.toUpperCase()})`;
      subtitle = `Cakupan: SPP, Uang Makan, Listrik & Air • Filter: ${bulanLabel}`;
      headers = [
        'No',
        'NIS',
        'Nama Santri',
        'Kelas',
        'Unit',
        'Bulan Menunggak',
        'Jumlah Bulan',
        'SPP (Perkiraan)',
        'Operasional (Makan/Listrik)',
        'Total Tunggakan Bulanan',
        'Nama Wali',
        'No. HP Wali',
      ];
      rows = filteredArrears.map((item, idx) => {
        const unpaidMonthsList =
          item.rincianBulanan
            ?.filter((m) => m.status === 'BELUM LUNAS')
            .map((m) => m.periode)
            .join(', ') || item.periodeTerlama || '-';

        return [
          idx + 1,
          item.nis,
          item.namaSantri,
          item.kelas,
          item.unit,
          unpaidMonthsList,
          `${item.monthsUnpaidCount} Bulan`,
          `Rp ${Math.round(item.tunggakanBulanan * 0.65).toLocaleString('id-ID')}`,
          `Rp ${Math.round(item.tunggakanBulanan * 0.35).toLocaleString('id-ID')}`,
          `Rp ${item.tunggakanBulanan.toLocaleString('id-ID')}`,
          item.namaWali,
          item.noHpWali,
        ];
      });
    } else {
      headers = [
        'No',
        'NIS',
        'Nama Santri',
        'Kelas',
        'Unit',
        'Tunggakan Bulanan',
        'Tunggakan Tahunan',
        'Total Tunggakan',
        'Prioritas',
        'Durasi Menunggak',
        'Nama Wali',
        'No. HP Wali',
      ];
      rows = filteredArrears.map((item, idx) => [
        idx + 1,
        item.nis,
        item.namaSantri,
        item.kelas,
        item.unit,
        `Rp ${item.tunggakanBulanan.toLocaleString('id-ID')}`,
        `Rp ${item.tunggakanTahunan.toLocaleString('id-ID')}`,
        `Rp ${item.totalTunggakan.toLocaleString('id-ID')}`,
        item.priority,
        `${item.monthsUnpaidCount} Bulan`,
        item.namaWali,
        item.noHpWali,
      ]);
    }

    const totalNominal = filteredArrears.reduce((acc, curr) => {
      if (isPerItemTahunan) {
        const key = filter.filterItemTahunan!.toLowerCase();
        if (key.includes('pembangunan')) return acc + (curr.rincianTahunan?.pembangunan?.sisa || 0);
        if (key.includes('kertas')) return acc + (curr.rincianTahunan?.kertas?.sisa || 0);
        if (key.includes('kegiatan')) return acc + (curr.rincianTahunan?.kegiatan?.sisa || 0);
      }
      if (isTahunan) return acc + curr.tunggakanTahunan;
      if (isBulanan) return acc + curr.tunggakanBulanan;
      return acc + curr.totalTunggakan;
    }, 0);

    downloadExcelSpreadsheet('Rekap_Tunggakan_Santri_Mahato.xls', {
      title,
      subtitle,
      headers,
      rows,
      summary: [
        { label: 'Total Santri Terdata', value: `${filteredArrears.length} Santri` },
        { label: 'Total Akumulasi Piutang', value: `Rp ${totalNominal.toLocaleString('id-ID')}` },
      ],
    });

    showToast('File Excel Rekap Tunggakan berhasil diunduh ke folder Downloads!');
  };

  const handleConfirmExportReport = (config: any) => {
    const isBulanan =
      config.jenisTunggakan === 'Bulanan Saja' ||
      (config.filterBulan && config.filterBulan !== 'Semua Bulan');
    const isPerItemTahunan =
      config.filterItemTahunan &&
      config.filterItemTahunan !== 'Semua Item Tahunan' &&
      config.filterItemTahunan !== 'Semua Item';
    const isTahunan = config.jenisTunggakan === 'Tahunan Saja' || isPerItemTahunan;

    const unitTag = (config.unit || 'Semua_Unit').replace(/\s+/g, '_');
    const scopeTag = isBulanan ? 'Bulanan' : isTahunan ? 'Tahunan' : 'Semua';
    const filename = `Laporan_Tunggakan_${scopeTag}_${unitTag}_${new Date().getFullYear()}`;

    // Filter the records according to the modal config
    const exportData = arrearsList.filter((item) => {
      if (config.unit && config.unit !== 'Semua Unit' && item.unit !== config.unit) return false;
      if (config.kelas && config.kelas !== 'Semua Kelas' && item.kelas !== config.kelas) return false;

      if (config.jenisTunggakan === 'Bulanan Saja' || isBulanan) {
        if (item.tunggakanBulanan <= 0) return false;
        if (config.filterBulan && config.filterBulan !== 'Semua Bulan') {
          const target = config.filterBulan.trim().toLowerCase();
          const match =
            item.rincianBulanan?.some((m) => m.periode.toLowerCase() === target && m.status === 'BELUM LUNAS') ||
            (item.periodeTerlama && item.periodeTerlama.toLowerCase() === target);
          if (!match) return false;
        }
      } else if (config.jenisTunggakan === 'Tahunan Saja' || isTahunan) {
        if (item.tunggakanTahunan <= 0) return false;
        if (isPerItemTahunan) {
          const key = config.filterItemTahunan.toLowerCase();
          if (key.includes('pembangunan') && (item.rincianTahunan?.pembangunan?.sisa || 0) <= 0) return false;
          if (key.includes('kertas') && (item.rincianTahunan?.kertas?.sisa || 0) <= 0) return false;
          if (key.includes('kegiatan') && (item.rincianTahunan?.kegiatan?.sisa || 0) <= 0) return false;
        }
      }

      return true;
    });

    const totalNominal = exportData.reduce((acc, curr) => {
      if (isPerItemTahunan) {
        const key = config.filterItemTahunan.toLowerCase();
        if (key.includes('pembangunan')) return acc + (curr.rincianTahunan?.pembangunan?.sisa || 0);
        if (key.includes('kertas')) return acc + (curr.rincianTahunan?.kertas?.sisa || 0);
        if (key.includes('kegiatan')) return acc + (curr.rincianTahunan?.kegiatan?.sisa || 0);
      }
      if (isTahunan) return acc + curr.tunggakanTahunan;
      if (isBulanan) return acc + curr.tunggakanBulanan;
      return acc + curr.totalTunggakan;
    }, 0);

    if (config.format === 'excel') {
      let headers: string[] = [];
      let rows: (string | number)[][] = [];
      let title = `LAPORAN RESMI TUNGGAKAN - ${config.unit.toUpperCase()}`;
      let subtitle = `Kelas: ${config.kelas} • Jenis: ${config.jenisTunggakan}`;

      if (isPerItemTahunan) {
        const itemKey = config.filterItemTahunan.toLowerCase();
        const itemLabel = itemKey.includes('pembangunan')
          ? 'Uang Pembangunan'
          : itemKey.includes('kertas')
          ? 'Uang Kertas & Ujian'
          : 'Uang Kegiatan Santri';

        title = `LAPORAN RESMI TUNGGAKAN TAHUNAN - ${itemLabel.toUpperCase()}`;
        subtitle = `Komponen: ${itemLabel} • Unit: ${config.unit} • Kelas: ${config.kelas}`;
        headers = [
          'No',
          'NIS',
          'Nama Santri',
          'Kelas / Unit',
          'Kewajiban Tagihan',
          'Sudah Terbayar',
          `Sisa Tunggakan ${itemLabel}`,
          'Status Pelunasan',
          'Wali Santri',
          'Kontak',
        ];
        rows = exportData.map((item, idx) => {
          const detail = itemKey.includes('pembangunan')
            ? item.rincianTahunan?.pembangunan
            : itemKey.includes('kertas')
            ? item.rincianTahunan?.kertas
            : item.rincianTahunan?.kegiatan;
          const totalWajib = detail?.nominal || 0;
          const sisa = detail?.sisa || 0;
          const dibayar = detail?.terbayar || Math.max(0, totalWajib - sisa);
          const status = sisa <= 0 ? 'Lunas' : dibayar > 0 ? 'Cicilan' : 'Belum Bayar';

          return [
            idx + 1,
            item.nis,
            item.namaSantri,
            `${item.kelas} (${item.unit})`,
            `Rp ${totalWajib.toLocaleString('id-ID')}`,
            `Rp ${dibayar.toLocaleString('id-ID')}`,
            `Rp ${sisa.toLocaleString('id-ID')}`,
            status,
            config.includeGuardian ? item.namaWali : '-',
            config.includeGuardian ? item.noHpWali : '-',
          ];
        });
      } else if (isTahunan) {
        title = `LAPORAN RESMI TUNGGAKAN IURAN TAHUNAN (PER POS)`;
        subtitle = `Pembangunan, Kertas, Kegiatan • Unit: ${config.unit} • Kelas: ${config.kelas}`;
        headers = [
          'No',
          'NIS',
          'Nama Santri',
          'Kelas / Unit',
          'Sisa Pembangunan',
          'Sisa Kertas & Ujian',
          'Sisa Kegiatan',
          'Total Tunggakan Tahunan',
          'Wali Santri',
          'Kontak',
        ];
        rows = exportData.map((item, idx) => [
          idx + 1,
          item.nis,
          item.namaSantri,
          `${item.kelas} (${item.unit})`,
          `Rp ${(item.rincianTahunan?.pembangunan?.sisa || 0).toLocaleString('id-ID')}`,
          `Rp ${(item.rincianTahunan?.kertas?.sisa || 0).toLocaleString('id-ID')}`,
          `Rp ${(item.rincianTahunan?.kegiatan?.sisa || 0).toLocaleString('id-ID')}`,
          `Rp ${item.tunggakanTahunan.toLocaleString('id-ID')}`,
          config.includeGuardian ? item.namaWali : '-',
          config.includeGuardian ? item.noHpWali : '-',
        ]);
      } else if (isBulanan) {
        const bulanLabel = config.filterBulan && config.filterBulan !== 'Semua Bulan' ? config.filterBulan : 'Semua Bulan Menunggak';
        title = `LAPORAN RESMI TUNGGAKAN BULANAN SANTRI (${bulanLabel.toUpperCase()})`;
        subtitle = `Cakupan: SPP & Operasional Pesantren • Unit: ${config.unit} • Kelas: ${config.kelas}`;
        headers = [
          'No',
          'NIS',
          'Nama Santri',
          'Kelas / Unit',
          'Bulan Menunggak',
          'Durasi',
          'Total Tunggakan Bulanan',
          'Wali Santri',
          'Kontak',
        ];
        rows = exportData.map((item, idx) => {
          const unpaidMonthsList =
            item.rincianBulanan
              ?.filter((m) => m.status === 'BELUM LUNAS')
              .map((m) => m.periode)
              .join(', ') || item.periodeTerlama || '-';

          return [
            idx + 1,
            item.nis,
            item.namaSantri,
            `${item.kelas} (${item.unit})`,
            unpaidMonthsList,
            `${item.monthsUnpaidCount} Bulan`,
            `Rp ${item.tunggakanBulanan.toLocaleString('id-ID')}`,
            config.includeGuardian ? item.namaWali : '-',
            config.includeGuardian ? item.noHpWali : '-',
          ];
        });
      } else {
        headers = [
          'No',
          'NIS',
          'Nama Santri',
          'Kelas / Unit',
          'Tunggakan Bulanan',
          'Tunggakan Tahunan',
          'Total Tunggakan',
          'Prioritas',
          'Wali Santri',
          'Kontak',
        ];
        rows = exportData.map((item, idx) => [
          idx + 1,
          item.nis,
          item.namaSantri,
          `${item.kelas} (${item.unit})`,
          `Rp ${item.tunggakanBulanan.toLocaleString('id-ID')}`,
          `Rp ${item.tunggakanTahunan.toLocaleString('id-ID')}`,
          `Rp ${item.totalTunggakan.toLocaleString('id-ID')}`,
          item.priority,
          config.includeGuardian ? item.namaWali : '-',
          config.includeGuardian ? item.noHpWali : '-',
        ]);
      }

      downloadExcelSpreadsheet(`${filename}.xls`, {
        title,
        subtitle,
        headers,
        rows,
        summary: [
          { label: 'Jumlah Santri Terdaftar', value: `${exportData.length} Santri` },
          { label: 'Total Nominal Piutang', value: `Rp ${totalNominal.toLocaleString('id-ID')}` },
        ],
      });
      showToast(`File ${filename}.xls berhasil diunduh ke folder Downloads!`);
    } else {
      // PDF / HTML Printable Report Format
      let reportTitle = 'Laporan Rekapitulasi Piutang & Tunggakan Santri';
      let reportBadge = 'PIUTANG PENDIDIKAN';
      let theadHtml = '';
      let tbodyHtml = '';

      if (isPerItemTahunan) {
        const itemKey = config.filterItemTahunan.toLowerCase();
        const itemLabel = itemKey.includes('pembangunan')
          ? 'Uang Pembangunan'
          : itemKey.includes('kertas')
          ? 'Uang Kertas & Ujian'
          : 'Uang Kegiatan Santri';

        reportTitle = `Rekapitulasi Tunggakan Iuran Tahunan — ${itemLabel}`;
        reportBadge = `TAHUNAN • ${itemLabel.toUpperCase()}`;
        theadHtml = `
          <tr>
            <th style="width:25px;">No</th>
            <th>NIS</th>
            <th>Nama Santri</th>
            <th>Kelas / Unit</th>
            <th style="text-align:right;">Kewajiban</th>
            <th style="text-align:right;">Terbayar</th>
            <th style="text-align:right;">Sisa Tunggakan</th>
            <th style="text-align:center;">Status</th>
            ${config.includeGuardian ? '<th>Wali Santri</th><th>No. Kontak</th>' : ''}
          </tr>
        `;
        tbodyHtml = exportData.map((item, i) => {
          const detail = itemKey.includes('pembangunan')
            ? item.rincianTahunan?.pembangunan
            : itemKey.includes('kertas')
            ? item.rincianTahunan?.kertas
            : item.rincianTahunan?.kegiatan;
          const totalWajib = detail?.nominal || 0;
          const sisa = detail?.sisa || 0;
          const dibayar = detail?.terbayar || Math.max(0, totalWajib - sisa);
          const statusBadge = sisa <= 0
            ? '<span style="background:#dcfce7;color:#166534;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:bold;">LUNAS</span>'
            : dibayar > 0
            ? '<span style="background:#fef3c7;color:#92400e;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:bold;">CICILAN</span>'
            : '<span style="background:#fee2e2;color:#991b1b;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:bold;">BELUM BAYAR</span>';

          return `
            <tr>
              <td>${i + 1}</td>
              <td>${item.nis}</td>
              <td><strong>${item.namaSantri}</strong></td>
              <td>${item.kelas} (${item.unit})</td>
              <td style="text-align:right;">Rp ${totalWajib.toLocaleString('id-ID')}</td>
              <td style="text-align:right;color:#047857;">Rp ${dibayar.toLocaleString('id-ID')}</td>
              <td style="text-align:right;color:#991b1b;font-weight:bold;">Rp ${sisa.toLocaleString('id-ID')}</td>
              <td style="text-align:center;">${statusBadge}</td>
              ${config.includeGuardian ? `<td>${item.namaWali}</td><td>${item.noHpWali}</td>` : ''}
            </tr>
          `;
        }).join('');
      } else if (isTahunan) {
        reportTitle = 'Rekapitulasi Tunggakan Iuran Tahunan Santri (Per Pos Tagihan)';
        reportBadge = 'TAHUNAN PER ITEM';
        theadHtml = `
          <tr>
            <th style="width:25px;">No</th>
            <th>NIS</th>
            <th>Nama Santri</th>
            <th>Kelas / Unit</th>
            <th style="text-align:right;">Pembangunan</th>
            <th style="text-align:right;">Kertas & Ujian</th>
            <th style="text-align:right;">Kegiatan Santri</th>
            <th style="text-align:right;">Total Tahunan</th>
            ${config.includeGuardian ? '<th>Wali Santri</th><th>No. Kontak</th>' : ''}
          </tr>
        `;
        tbodyHtml = exportData.map((item, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${item.nis}</td>
            <td><strong>${item.namaSantri}</strong></td>
            <td>${item.kelas} (${item.unit})</td>
            <td style="text-align:right;color:#b45309;">Rp ${(item.rincianTahunan?.pembangunan?.sisa || 0).toLocaleString('id-ID')}</td>
            <td style="text-align:right;color:#b45309;">Rp ${(item.rincianTahunan?.kertas?.sisa || 0).toLocaleString('id-ID')}</td>
            <td style="text-align:right;color:#b45309;">Rp ${(item.rincianTahunan?.kegiatan?.sisa || 0).toLocaleString('id-ID')}</td>
            <td style="text-align:right;color:#991b1b;font-weight:bold;">Rp ${item.tunggakanTahunan.toLocaleString('id-ID')}</td>
            ${config.includeGuardian ? `<td>${item.namaWali}</td><td>${item.noHpWali}</td>` : ''}
          </tr>
        `).join('');
      } else if (isBulanan) {
        const bulanLabel = config.filterBulan && config.filterBulan !== 'Semua Bulan' ? config.filterBulan : 'Semua Bulan Menunggak';
        reportTitle = `Rekapitulasi Tunggakan Bulanan Santri — ${bulanLabel}`;
        reportBadge = 'BULANAN SAJA';
        theadHtml = `
          <tr>
            <th style="width:25px;">No</th>
            <th>NIS</th>
            <th>Nama Santri</th>
            <th>Kelas / Unit</th>
            <th>Bulan Menunggak</th>
            <th style="text-align:center;">Lama</th>
            <th style="text-align:right;">Total Bulanan</th>
            ${config.includeGuardian ? '<th>Wali Santri</th><th>No. Kontak</th>' : ''}
          </tr>
        `;
        tbodyHtml = exportData.map((item, i) => {
          const unpaidMonthsList =
            item.rincianBulanan
              ?.filter((m) => m.status === 'BELUM LUNAS')
              .map((m) => m.periode)
              .join(', ') || item.periodeTerlama || '-';

          return `
            <tr>
              <td>${i + 1}</td>
              <td>${item.nis}</td>
              <td><strong>${item.namaSantri}</strong></td>
              <td>${item.kelas} (${item.unit})</td>
              <td style="font-size:9.5px;color:#92400e;"><strong>${unpaidMonthsList}</strong></td>
              <td style="text-align:center;">${item.monthsUnpaidCount} Bln</td>
              <td style="text-align:right;color:#991b1b;font-weight:bold;">Rp ${item.tunggakanBulanan.toLocaleString('id-ID')}</td>
              ${config.includeGuardian ? `<td>${item.namaWali}</td><td>${item.noHpWali}</td>` : ''}
            </tr>
          `;
        }).join('');
      } else {
        theadHtml = `
          <tr>
            <th style="width:25px;">No</th>
            <th>NIS</th>
            <th>Nama Santri</th>
            <th>Kelas / Unit</th>
            <th>Bulan Menunggak</th>
            <th style="text-align:right;">Bulanan</th>
            <th style="text-align:right;">Tahunan</th>
            <th style="text-align:right;">Total Tunggakan</th>
            ${config.includeGuardian ? '<th>Wali Santri</th><th>No. Kontak</th>' : ''}
          </tr>
        `;
        tbodyHtml = exportData.map((a, i) => {
          const unpaidMonths =
            a.rincianBulanan
              ?.filter((m) => m.status === 'BELUM LUNAS')
              .map((m) => m.periode)
              .join(', ') || a.periodeTerlama || '-';

          return `
            <tr>
              <td>${i + 1}</td>
              <td>${a.nis}</td>
              <td><strong>${a.namaSantri}</strong></td>
              <td>${a.kelas} (${a.unit})</td>
              <td style="font-size:9px;color:#92400e;">${unpaidMonths}</td>
              <td style="text-align:right;">Rp ${a.tunggakanBulanan.toLocaleString('id-ID')}</td>
              <td style="text-align:right;">Rp ${a.tunggakanTahunan.toLocaleString('id-ID')}</td>
              <td style="text-align:right;color:#991b1b;font-weight:bold;">Rp ${a.totalTunggakan.toLocaleString('id-ID')}</td>
              ${config.includeGuardian ? `<td>${a.namaWali}</td><td>${a.noHpWali}</td>` : ''}
            </tr>
          `;
        }).join('');
      }

      const contentHtml = `
        <div class="kop-header">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="kop-logo">R</div>
            <div class="kop-text">
              <h1>Pondok Modern Raudhatussalam Mahato</h1>
              <p>Bagian Keuangan & Administrasi Santri • Sistem Informasi Manajemen Keuangan</p>
            </div>
          </div>
          <div style="text-align:right;">
            <span style="background:#fee2e2;color:#991b1b;padding:4px 8px;border-radius:4px;font-weight:bold;font-size:9px;">${reportBadge}</span>
            <p style="margin-top:4px;font-size:9px;color:#64748b;">${new Date().toLocaleDateString('id-ID')}</p>
          </div>
        </div>

        <h2 style="text-align:center;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;margin-top:10px;">${reportTitle}</h2>
        <p style="text-align:center;font-size:10px;color:#475569;margin-top:2px;margin-bottom:12px;">
          Unit: <strong>${config.unit}</strong> • Tingkat: <strong>${config.kelas}</strong> • Total Terdata: <strong>${exportData.length} Santri</strong> • Total Piutang: <strong style="color:#991b1b;">Rp ${totalNominal.toLocaleString('id-ID')}</strong>
        </p>

        <table>
          <thead>
            ${theadHtml}
          </thead>
          <tbody>
            ${tbodyHtml}
          </tbody>
          <tfoot>
            <tr style="background:#f8fafc;font-weight:bold;">
              <td colspan="${isPerItemTahunan ? 6 : isTahunan ? 7 : isBulanan ? 6 : 7}" style="text-align:right;padding:8px;">TOTAL AKUMULASI:</td>
              <td style="text-align:right;color:#991b1b;padding:8px;font-size:11px;">Rp ${totalNominal.toLocaleString('id-ID')}</td>
              ${config.includeGuardian ? '<td colspan="2"></td>' : ''}
            </tr>
          </tfoot>
        </table>

        ${
          config.includeSignature
            ? `
        <div class="footer-signatures" style="margin-top:28px;">
          <div class="signature-box">
            <p>Mengetahui,</p>
            <p><strong>Bagian Administrasi & Keuangan</strong></p>
            <div class="signature-space"></div>
            <p style="text-decoration:underline;font-weight:bold;">Ust. Syahrul Ramadhan</p>
            <p style="font-size:8px;color:#64748b;">NIP. 202008.014</p>
          </div>
          <div class="signature-box">
            <p>Mahato, ${new Date().toLocaleDateString('id-ID')}</p>
            <p><strong>Bendahara Pondok Modern</strong></p>
            <div class="signature-space"></div>
            <p style="text-decoration:underline;font-weight:bold;">H. Ahmad Syarif, M.Pd.</p>
            <p style="font-size:8px;color:#64748b;">NIP. 201501.002</p>
          </div>
        </div>`
            : ''
        }
      `;
      downloadPrintableReport(`${filename}.html`, reportTitle, contentHtml);
      showToast(`Dokumen laporan cetak "${filename}.html" berhasil diunduh! Silakan buka file untuk mencetak langsung atau simpan PDF.`);
    }
  };

  const handlePrintInvoice = (item: StudentArrearItem) => {
    setSelectedArrearForPrint(item);
    setIsArrearPrintModalOpen(true);
  };

  return (
    <div id="page-tunggakan-santri" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-medium hover:text-[#064E3B] cursor-pointer">
              <Home className="w-3.5 h-3.5" />
              <span>SIMKEU</span>
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-medium text-slate-600">Tagihan</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-[#064E3B]">Tunggakan Santri</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Tunggakan Santri
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring sentral tagihan santri yang belum diselesaikan (Bulanan & Tahunan)
          </p>
        </div>

        {/* Academic Year Info Badge & Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs">
            <Calendar className="w-4 h-4 text-[#064E3B]" />
            <span className="text-slate-600 font-medium">T.A:</span>
            <span className="font-extrabold text-[#064E3B]">2026 / 2027</span>
          </div>

          <button
            type="button"
            id="btn-header-export-arrears"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap Tunggakan</span>
          </button>
        </div>
      </div>

      {/* 1. Summary Cards (4 Cards) */}
      <ArrearsSummaryCards
        kpi={kpiData}
        selectedJenisTunggakan={filter.jenisTunggakan}
        onSelectJenis={(jenis) => handleUpdateFilter({ jenisTunggakan: jenis })}
      />

      {/* 2. Arrears Alert Panel (Perlu Perhatian Warning) */}
      <ArrearsAlertPanel
        kpi={kpiData}
        onFilterPriority={() =>
          handleUpdateFilter({ priorityFilter: 'HIGH', kategoriTunggakan: 'Semua Kategori' })
        }
        onFilterCategory={(cat) =>
          handleUpdateFilter({ kategoriTunggakan: cat, priorityFilter: 'Semua' })
        }
      />

      {/* 3. Priority Collection Matrix Card */}
      <ArrearsPriorityCard
        kpi={kpiData}
        currentPriorityFilter={filter.priorityFilter}
        onSelectPriority={(p) => handleUpdateFilter({ priorityFilter: p })}
      />

      {/* 4. Main Section: Filter Toolbar + Data Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <ArrearsFilterToolbar
          filter={filter}
          onChangeFilter={handleUpdateFilter}
          onResetFilter={handleResetFilter}
          totalFiltered={filteredArrears.length}
          totalRecords={arrearsList.length}
        />

        <ArrearsTable
          arrears={filteredArrears}
          onViewDetail={handleOpenDetail}
          onNavigateToStudentDetail={onNavigateToStudentDetail}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onExportExcelQuick={handleQuickExportExcel}
          onCopyPhone={handleCopyPhone}
          onSendWhatsapp={handleSendWhatsapp}
        />
      </div>

      {/* 5. Visual Analytics Section (Unit, Kelas, Komposisi) */}
      <div className="pt-2">
        <ArrearsAnalyticsSection kpi={kpiData} />
      </div>

      {/* 6. Aging Analysis & Trend & Top 5 Rankings */}
      <div className="pt-2">
        <ArrearsAgingAndTrend
          kpi={kpiData}
          onSelectStudentByNis={handleSelectStudentByNis}
          onFilterCategory={(cat) =>
            handleUpdateFilter({ kategoriTunggakan: cat, priorityFilter: 'Semua' })
          }
        />
      </div>

      {/* 7. Slide-over Detail Drawer */}
      <ArrearsDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        arrearItem={selectedStudent}
        onNavigateToStudentDetail={onNavigateToStudentDetail}
        onSendWhatsapp={handleSendWhatsapp}
        onCopyPhone={handleCopyPhone}
        onPrintInvoice={handlePrintInvoice}
      />

      {/* 8. Export Report Modal */}
      <ArrearsExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        kpi={kpiData}
        initialFilter={filter}
        onConfirmExport={handleConfirmExportReport}
      />

      {/* 9. Arrears Invoice Print Modal */}
      <ArrearsInvoicePrintModal
        isOpen={isArrearPrintModalOpen}
        onClose={() => setIsArrearPrintModalOpen(false)}
        arrear={selectedArrearForPrint}
      />
    </div>
  );
};
