import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileSpreadsheet,
  Save,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info,
  Trash2,
} from 'lucide-react';
import { GenerateBillingConfig, GenerateStep, BillingDraft } from '../../types';
import { GenerateTagihanStepper } from './GenerateTagihanStepper';
import { Step1PilihPeriode } from './Step1PilihPeriode';
import { Step2AturTagihanDiskon } from './Step2AturTagihanDiskon';
import { Step3PreviewTagihan } from './Step3PreviewTagihan';
import { Step4Konfirmasi } from './Step4Konfirmasi';
import { GenerateSuccessView } from './GenerateSuccessView';

interface GenerateTagihanBulananViewProps {
  onBackToTagihanList: () => void;
  onNavigateToDashboard: () => void;
  onShowToast: (message: string) => void;
}

const DEFAULT_CONFIG: GenerateBillingConfig = {
  tahunAjaran: '2026 / 2027',
  bulan: 'September 2026', // Fresh ungenerated month by default
  tanggalJatuhTempo: '10 September 2026',
  sppNominal: 200000,
  listrikAirNominal: 50000,
  paketANominal: 0,
  paketADiscount: 0,
  paketBNominal: 200000,
  paketBDiscount: 0,
  paketCNominal: 600000,
  paketCDiscount: 0,
  catatanDiskon: '',
  targetUnit: 'Semua Unit',
};

const DRAFT_STORAGE_KEY = 'simkeu_generate_bill_draft';

export const GenerateTagihanBulananView: React.FC<GenerateTagihanBulananViewProps> = ({
  onBackToTagihanList,
  onNavigateToDashboard,
  onShowToast,
}) => {
  const [currentStep, setCurrentStep] = useState<GenerateStep>(1);
  const [config, setConfig] = useState<GenerateBillingConfig>(DEFAULT_CONFIG);
  const [existingPeriods, setExistingPeriods] = useState<string[]>([
    'Juli 2026',
    'Agustus 2026',
  ]);
  const [savedDraft, setSavedDraft] = useState<BillingDraft | null>(null);

  // Check localStorage for saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed: BillingDraft = JSON.parse(saved);
        setSavedDraft(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleConfigChange = (newValues: Partial<GenerateBillingConfig>) => {
    setConfig((prev) => ({ ...prev, ...newValues }));
  };

  const handleSaveDraft = () => {
    const draft: BillingDraft = {
      id: `draft-${Date.now()}`,
      savedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      config,
    };
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setSavedDraft(draft);
      onShowToast(`Konfigurasi tagihan periode ${config.bulan} disimpan sebagai Draft.`);
    } catch {
      onShowToast('Draft berhasil disimpan di memori sementara.');
    }
  };

  const handleLoadDraft = () => {
    if (savedDraft) {
      setConfig(savedDraft.config);
      onShowToast(`Draft konfigurasi periode ${savedDraft.config.bulan} berhasil dimuat.`);
    }
  };

  const handleDeleteDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setSavedDraft(null);
      onShowToast('Draft konfigurasi tagihan telah dihapus.');
    } catch {
      setSavedDraft(null);
    }
  };

  const handleConfirmFinalGenerate = () => {
    // Add period to existing list to prevent re-generation
    setExistingPeriods((prev) => (prev.includes(config.bulan) ? prev : [...prev, config.bulan]));
    // Clear draft if it matches
    if (savedDraft && savedDraft.config.bulan === config.bulan) {
      handleDeleteDraft();
    }
    setCurrentStep(5);
    onShowToast(`Berhasil menerbitkan 300 tagihan santri untuk periode ${config.bulan}!`);
  };

  // Calculate finals for success view
  const countPaketA = 35;
  const countPaketB = 65;
  const countPaketC = 200;
  const totalDiskon =
    config.paketADiscount * countPaketA +
    config.paketBDiscount * countPaketB +
    config.paketCDiscount * countPaketC;
  const totalKotor =
    (config.sppNominal + config.paketANominal + config.listrikAirNominal) * countPaketA +
    (config.sppNominal + config.paketBNominal + config.listrikAirNominal) * countPaketB +
    (config.sppNominal + config.paketCNominal + config.listrikAirNominal) * countPaketC;
  const totalAkhir = totalKotor - totalDiskon;

  return (
    <div id="generate-tagihan-bulanan-page" className="space-y-6 pb-16">
      {/* 1. Back Navigation Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          id="btn-back-to-tagihan"
          onClick={onBackToTagihanList}
          className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[#64748B] hover:text-[#064E3B] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Tagihan Bulanan</span>
        </button>

        {currentStep < 5 && (
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mode Pembuatan Tagihan Massal</span>
          </div>
        )}
      </div>

      {/* 2. Draft Available Banner (If Draft exists) */}
      {savedDraft && currentStep < 5 && (
        <div
          id="banner-draft-exists"
          className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2 text-blue-900 font-medium">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              Tersedia draf tersimpan untuk periode <strong>{savedDraft.config.bulan}</strong> (disimpan pukul {savedDraft.savedAt}).
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-load-draft"
              onClick={handleLoadDraft}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-2xs"
            >
              Muat Draf
            </button>
            <button
              type="button"
              id="btn-delete-draft"
              onClick={handleDeleteDraft}
              className="p-1.5 text-blue-600 hover:text-rose-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Hapus draf"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Workflow Stepper (Hidden on final success screen) */}
      {currentStep < 5 && (
        <GenerateTagihanStepper
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step < currentStep) {
              setCurrentStep(step);
            }
          }}
        />
      )}

      {/* 4. Active Step Content */}
      {currentStep === 1 && (
        <Step1PilihPeriode
          config={config}
          onChangeConfig={handleConfigChange}
          onNext={() => setCurrentStep(2)}
          onViewExistingBills={(period) => {
            onBackToTagihanList();
            onShowToast(`Melihat tagihan untuk periode ${period}`);
          }}
          existingPeriods={existingPeriods}
        />
      )}

      {currentStep === 2 && (
        <Step2AturTagihanDiskon
          config={config}
          onChangeConfig={handleConfigChange}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && (
        <Step3PreviewTagihan
          config={config}
          onBack={() => setCurrentStep(2)}
          onSaveDraft={handleSaveDraft}
          onNext={() => setCurrentStep(4)}
        />
      )}

      {currentStep === 4 && (
        <Step4Konfirmasi
          config={config}
          onBack={() => setCurrentStep(3)}
          onSaveDraft={handleSaveDraft}
          onConfirmGenerate={handleConfirmFinalGenerate}
        />
      )}

      {currentStep === 5 && (
        <GenerateSuccessView
          config={config}
          totalAkhir={totalAkhir}
          totalDiskon={totalDiskon}
          onNavigateToTagihan={onBackToTagihanList}
          onNavigateToDashboard={onNavigateToDashboard}
        />
      )}
    </div>
  );
};
