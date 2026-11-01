import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { ImportSummaryCards } from './ImportSummaryCards';
import { WorkflowStepper, ImportStep } from './WorkflowStepper';
import { Step1UploadFile, UploadedFileInfo } from './Step1UploadFile';
import { Step2ColumnMapping } from './Step2ColumnMapping';
import { Step3PreviewValidation } from './Step3PreviewValidation';
import { Step4ConfirmImport } from './Step4ConfirmImport';
import { Step5ImportSuccess } from './Step5ImportSuccess';
import { BankReconciliationIndicator } from './BankReconciliationIndicator';
import { ImportHistoryTable } from './ImportHistoryTable';
import { sampleImportSummaryStats } from '../../data/importPaymentData';

interface ImportPembayaranViewProps {
  onNavigateToTunggakan?: () => void;
  onNavigateToBulanan?: () => void;
  onNavigateToTahunan?: () => void;
}

export const ImportPembayaranView: React.FC<ImportPembayaranViewProps> = ({
  onNavigateToTunggakan,
  onNavigateToBulanan,
  onNavigateToTahunan,
}) => {
  const [currentStep, setCurrentStep] = useState<ImportStep>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(3); // Set to 3 by default so preview is readily accessible
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>({
    name: 'pembayaran_agustus_2026.xlsx',
    size: '245 KB',
    totalRows: 1245,
    uploadDate: '31 Agustus 2026',
    format: 'xlsx',
  });

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSelectFile = (fileInfo: UploadedFileInfo) => {
    setUploadedFile(fileInfo);
    setMaxStepReached(Math.max(maxStepReached, 2));
    showToast(`File ${fileInfo.name} berhasil dibaca (${fileInfo.totalRows.toLocaleString('id-ID')} baris).`, 'success');
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setCurrentStep(1);
    setMaxStepReached(1);
    showToast('File pembayaran telah dihapus.', 'info');
  };

  const handleStepChange = (step: ImportStep) => {
    setCurrentStep(step);
    if (step > maxStepReached) {
      setMaxStepReached(step);
    }
  };

  const handleDownloadTemplate = () => {
    showToast('Mengunduh template file pembayaran: template_import_pembayaran_simkeu.xlsx', 'info');
  };

  const handleDownloadBeritaAcaraPdf = (batchId?: string) => {
    showToast(`Mengunduh Berita Acara & Laporan Rekonsiliasi (${batchId || 'IMP-20260831-001'}).pdf`, 'success');
  };

  const handleSaveDraft = () => {
    showToast('Draf validasi import berhasil disimpan. Anda dapat melanjutkannya kapan saja.', 'info');
  };

  const handleResetWorkflow = () => {
    setCurrentStep(1);
    setMaxStepReached(1);
    setUploadedFile(null);
    showToast('Siap untuk proses import file pembayaran baru.', 'info');
  };

  return (
    <div id="page-import-pembayaran" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-bold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toastMessage.type === 'warning'
                ? 'bg-amber-900 text-white border-amber-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Info className="w-4 h-4 text-blue-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Header / Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Keuangan</span>
            <span>/</span>
            <span>Transaksi</span>
            <span>/</span>
            <span className="text-[#064E3B] font-bold">Import Pembayaran</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Import Pembayaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Import data pembayaran dari aplikasi eksternal dan cocokkan otomatis dengan tagihan santri SIMKEU.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="btn-top-download-template"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-[#064E3B] font-bold rounded-xl border border-slate-300 text-xs transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Template Excel</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <ImportSummaryCards stats={sampleImportSummaryStats} />

      {/* 5-Step Workflow Stepper */}
      <WorkflowStepper
        currentStep={currentStep}
        onSelectStep={handleStepChange}
        maxStepReached={maxStepReached}
      />

      {/* Active Step Content */}
      <div className="transition-all">
        {currentStep === 1 && (
          <Step1UploadFile
            uploadedFile={uploadedFile}
            onSelectFile={handleSelectFile}
            onRemoveFile={handleRemoveFile}
            onNextStep={() => handleStepChange(2)}
            onDownloadTemplate={handleDownloadTemplate}
          />
        )}

        {currentStep === 2 && (
          <Step2ColumnMapping
            onBackStep={() => handleStepChange(1)}
            onNextStep={() => handleStepChange(3)}
            fileName={uploadedFile?.name || 'pembayaran_agustus_2026.xlsx'}
          />
        )}

        {currentStep === 3 && (
          <Step3PreviewValidation
            onBackStep={() => handleStepChange(2)}
            onNextStep={() => handleStepChange(4)}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentStep === 4 && (
          <Step4ConfirmImport
            onBackStep={() => handleStepChange(3)}
            onImportComplete={() => handleStepChange(5)}
            fileName={uploadedFile?.name || 'pembayaran_agustus_2026.xlsx'}
            totalData={uploadedFile?.totalRows || 1245}
            validCount={1220}
            reviewCount={15}
            duplicateCount={10}
            totalNominal={325500000}
          />
        )}

        {currentStep === 5 && (
          <Step5ImportSuccess
            onResetImport={handleResetWorkflow}
            onViewProblems={() => handleStepChange(3)}
            onNavigateToTunggakan={onNavigateToTunggakan}
            onDownloadReportPdf={() => handleDownloadBeritaAcaraPdf('IMP-20260831-001')}
            totalProcessed={1220}
            totalNominal={325500000}
            monthlyPaidCount={850}
            annualPaidCount={370}
            problemCount={25}
          />
        )}
      </div>

      {/* Bank Reconciliation Card */}
      <BankReconciliationIndicator />

      {/* Import History Table */}
      <ImportHistoryTable
        onDownloadReportPdf={handleDownloadBeritaAcaraPdf}
      />
    </div>
  );
};
