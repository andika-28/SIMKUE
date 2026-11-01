import React, { useState } from 'react';
import {
  ArrowLeft,
  PieChart,
  Receipt,
  History,
  AlertCircle,
  User,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Student, DetailedBill, DetailedPayment } from '../../types';
import { StudentProfileCard } from './detail/StudentProfileCard';
import { FinancialSummaryCards } from './detail/FinancialSummaryCards';
import { TabRingkasan } from './detail/TabRingkasan';
import { TabTagihan } from './detail/TabTagihan';
import { TabRiwayatPembayaran } from './detail/TabRiwayatPembayaran';
import { TabTunggakan } from './detail/TabTunggakan';
import { TabProfil } from './detail/TabProfil';
import { BillDetailDrawer } from './detail/BillDetailDrawer';
import { PaymentReceiptDrawer } from './detail/PaymentReceiptDrawer';
import { OfficialReceiptModal } from './detail/OfficialReceiptModal';
import { AddStudentModal } from './AddStudentModal';
import {
  defaultStudentBills,
  defaultStudentPayments,
  defaultTimelineActivities,
} from '../../data/studentDetailData';
import { initialStudents, emptyStudentPlaceholder } from '../../data/studentsData';
import { downloadExcelSpreadsheet } from '../../utils/fileDownloader';

interface DetailKeuanganSantriViewProps {
  student?: Student;
  onBackToDataSantri: () => void;
  onSuccessToast: (msg: string) => void;
}

export const DetailKeuanganSantriView: React.FC<DetailKeuanganSantriViewProps> = ({
  student: initialStudentProp,
  onBackToDataSantri,
  onSuccessToast,
}) => {
  const defaultStudent: Student = initialStudents[0] || emptyStudentPlaceholder;

  const [currentStudent, setCurrentStudent] = useState<Student>(
    initialStudentProp || defaultStudent
  );

  // Tabs state: Ringkasan | Tagihan | Riwayat Pembayaran | Tunggakan | Profil
  const [activeTab, setActiveTab] = useState<string>('Ringkasan');

  // Bills & payments state
  const [bills, setBills] = useState<DetailedBill[]>(defaultStudentBills);
  const [payments, setPayments] = useState<DetailedPayment[]>(defaultStudentPayments);
  const [activities, setActivities] = useState(defaultTimelineActivities);

  // Drawer / Modal states
  const [selectedBillForDrawer, setSelectedBillForDrawer] = useState<DetailedBill | null>(null);
  const [selectedPaymentForDrawer, setSelectedPaymentForDrawer] = useState<DetailedPayment | null>(null);
  const [selectedPaymentForPrint, setSelectedPaymentForPrint] = useState<DetailedPayment | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);

  const tabsList = [
    { id: 'Ringkasan', label: 'Ringkasan', icon: PieChart },
    { id: 'Tagihan', label: 'Tagihan', icon: Receipt },
    { id: 'Riwayat Pembayaran', label: 'Riwayat Pembayaran', icon: History },
    { id: 'Tunggakan', label: 'Tunggakan', icon: AlertCircle, badge: '1' },
    { id: 'Profil', label: 'Profil', icon: User },
  ];

  // Actions
  const handleSendWhatsAppReminder = () => {
    const waUrl = `https://wa.me/${currentStudent.noHpWali.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      `Assalamu'alaikum Bapak/Ibu ${currentStudent.namaWali}, kami dari Bendahara Keuangan PM. Raudhatussalam Mahato menginformasikan tagihan santri ${currentStudent.nama} (NIS: ${currentStudent.nis}) bulan September 2026 sebesar Rp850.000. Terima kasih.`
    )}`;
    window.open(waUrl, '_blank');
    onSuccessToast('Tautan pengingat WhatsApp telah dibuka.');
  };

  const handleExportHistory = () => {
    const headers = ['No', 'No. Kwitansi', 'Tanggal Bayar', 'Deskripsi Tagihan', 'Nominal Bayar', 'Metode Pembayaran', 'Status', 'Petugas Kasir'];
    const rows = payments.map((p, idx) => [
      idx + 1,
      p.receiptNo,
      p.paymentDate,
      p.billTitle,
      `Rp ${p.amountPaid.toLocaleString('id-ID')}`,
      p.paymentMethod,
      p.status,
      p.cashierName,
    ]);

    const cleanName = currentStudent.nama.replace(/\s+/g, '_');
    downloadExcelSpreadsheet(`Riwayat_Bayar_${currentStudent.nis}_${cleanName}.xls`, {
      title: `RIWAYAT PEMBAYARAN SANTRI - ${currentStudent.nama.toUpperCase()}`,
      subtitle: `NIS: ${currentStudent.nis} • Kelas: ${currentStudent.kelas} (${currentStudent.unit}) • Wali: ${currentStudent.namaWali}`,
      headers,
      rows,
      summary: [
        { label: 'Total Pembayaran Masuk', value: `Rp ${payments.reduce((s, x) => s + x.amountPaid, 0).toLocaleString('id-ID')}` }
      ]
    });

    onSuccessToast(`File Riwayat_Bayar_${currentStudent.nis}_${cleanName}.xls berhasil diunduh ke folder Downloads!`);
  };

  const handleQuickPayArrears = () => {
    // Settle September bill
    setBills((prev) =>
      prev.map((b) =>
        b.id === 'bill-02'
          ? { ...b, status: 'LUNAS', terbayar: b.totalAkhir, tunggakan: 0 }
          : b
      )
    );
    const newPayment: DetailedPayment = {
      id: `pay-${Date.now()}`,
      tanggal: '01 Sep 2026',
      noReferensi: `PAY-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      jenisPembayaran: 'Tagihan Bulanan',
      periode: 'September 2026',
      nominal: 850000,
      metode: 'Kasir Keuangan Pesantren (Lunas)',
      sumber: 'Kasir Keuangan',
      status: 'Berhasil',
      namaSantri: currentStudent.nama,
      nis: currentStudent.nis,
      kelas: currentStudent.kelas,
      unit: currentStudent.unit,
      catatan: 'Pelunasan tunggakan tagihan September 2026',
    };
    setPayments((prev) => [newPayment, ...prev]);
    onSuccessToast('Tunggakan tagihan September 2026 berhasil dilunasi!');
  };

  return (
    <div id="detail-keuangan-santri-page" className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. BACK NAVIGATION BUTTON */}
      <div className="flex items-center justify-between">
        <button
          id="btn-kembali-data-santri"
          onClick={onBackToDataSantri}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#064E3B] px-3 py-1.5 rounded-lg hover:bg-slate-100/80 transition active:scale-98 group"
        >
          <ArrowLeft className="w-4 h-4 text-[#64748B] group-hover:-translate-x-0.5 transition" />
          <span>← Kembali ke Data Santri</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <span>Tahun Ajaran: <strong className="text-[#064E3B] font-bold">2026 / 2027</strong></span>
        </div>
      </div>

      {/* 2. STUDENT PROFILE HEADER CARD */}
      <StudentProfileCard
        student={currentStudent}
        onEditStudent={() => setShowEditProfileModal(true)}
        allStudents={initialStudents}
        onSelectAnotherStudent={(std) => {
          setCurrentStudent(std);
          onSuccessToast(`Memuat data keuangan santri: ${std.nama}`);
        }}
      />

      {/* 3. FINANCIAL SUMMARY (4 CARDS) */}
      <FinancialSummaryCards
        totalTagihan={8500000}
        totalPembayaran={bills.reduce((acc, b) => acc + b.terbayar, 0)}
        totalTunggakan={bills.reduce((acc, b) => acc + b.tunggakan, 0)}
        statusKeuangan={bills.some((b) => b.tunggakan > 0) ? 'BELUM LUNAS' : 'LUNAS'}
        academicYear="2026/2027"
      />

      {/* 4. MAIN TAB NAVIGATION */}
      <div className="border-b border-[#E2E8F0] bg-white rounded-t-xl px-4 pt-1 shadow-2xs">
        <nav className="flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabsList.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-1 border-b-2 font-semibold text-xs inline-flex items-center gap-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-[#064E3B] text-[#064E3B]'
                    : 'border-transparent text-[#64748B] hover:text-[#1E293B] hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#064E3B]' : 'text-[#94A3B8]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-emerald-100 text-[#064E3B]'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 5. TAB CONTENTS */}
      <div className="transition-all">
        {activeTab === 'Ringkasan' && (
          <TabRingkasan
            student={currentStudent}
            bills={bills}
            activities={activities}
            onOpenBillDetail={(bill) => setSelectedBillForDrawer(bill)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'Tagihan' && (
          <TabTagihan
            bills={bills}
            onOpenBillDetail={(bill) => setSelectedBillForDrawer(bill)}
          />
        )}

        {activeTab === 'Riwayat Pembayaran' && (
          <TabRiwayatPembayaran
            payments={payments}
            onOpenPaymentReceipt={(payment) => setSelectedPaymentForDrawer(payment)}
            onExportHistory={handleExportHistory}
          />
        )}

        {activeTab === 'Tunggakan' && (
          <TabTunggakan
            student={currentStudent}
            bills={bills}
            onOpenBillDetail={(bill) => setSelectedBillForDrawer(bill)}
            onSendWhatsAppReminder={handleSendWhatsAppReminder}
            onQuickPayArrears={handleQuickPayArrears}
          />
        )}

        {activeTab === 'Profil' && (
          <TabProfil
            student={currentStudent}
            onEditProfile={() => setShowEditProfileModal(true)}
          />
        )}
      </div>

      {/* DRAWERS & MODALS */}
      {/* 1. Tagihan Detail Drawer */}
      <BillDetailDrawer
        isOpen={!!selectedBillForDrawer}
        bill={selectedBillForDrawer}
        student={currentStudent}
        onClose={() => setSelectedBillForDrawer(null)}
        onSendWhatsApp={(bill) => {
          handleSendWhatsAppReminder();
        }}
        onPrintBill={(bill) => {
          window.print();
        }}
      />

      {/* 2. Payment Receipt Drawer */}
      <PaymentReceiptDrawer
        isOpen={!!selectedPaymentForDrawer}
        payment={selectedPaymentForDrawer}
        student={currentStudent}
        onClose={() => setSelectedPaymentForDrawer(null)}
        onOpenPrintModal={(payment) => {
          setSelectedPaymentForDrawer(null);
          setSelectedPaymentForPrint(payment);
        }}
      />

      {/* 3. Official Printable Receipt Modal */}
      <OfficialReceiptModal
        isOpen={!!selectedPaymentForPrint}
        onClose={() => setSelectedPaymentForPrint(null)}
        payment={selectedPaymentForPrint}
        student={currentStudent}
      />

      {/* 4. Edit Student Profile Modal */}
      <AddStudentModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        editingStudent={currentStudent}
        onSaveStudent={(updatedData) => {
          setCurrentStudent((prev) => ({
            ...prev,
            ...updatedData,
          }));
          setShowEditProfileModal(false);
          onSuccessToast(`Data santri ${updatedData.nama} berhasil diperbarui.`);
        }}
      />

    </div>
  );
};
