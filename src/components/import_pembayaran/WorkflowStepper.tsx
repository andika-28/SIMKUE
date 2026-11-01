import React from 'react';
import { Check, UploadCloud, Sliders, CheckSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

export type ImportStep = 1 | 2 | 3 | 4 | 5;

interface WorkflowStepperProps {
  currentStep: ImportStep;
  onSelectStep: (step: ImportStep) => void;
  maxStepReached: number;
}

interface StepItem {
  number: ImportStep;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStep,
  onSelectStep,
  maxStepReached,
}) => {
  const steps: StepItem[] = [
    {
      number: 1,
      title: 'Upload File',
      subtitle: 'Pilih file pembayaran',
      icon: UploadCloud,
    },
    {
      number: 2,
      title: 'Mapping Data',
      subtitle: 'Cocokkan kolom',
      icon: Sliders,
    },
    {
      number: 3,
      title: 'Preview & Validasi',
      subtitle: 'Periksa transaksi',
      icon: CheckSquare,
    },
    {
      number: 4,
      title: 'Konfirmasi Import',
      subtitle: 'Proses pembayaran',
      icon: ShieldCheck,
    },
    {
      number: 5,
      title: 'Selesai',
      subtitle: 'Lihat hasil import',
      icon: CheckCircle2,
    },
  ];

  return (
    <div
      id="workflow-stepper-container"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-2">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep || (currentStep === 5 && step.number === 5);
          const isActive = step.number === currentStep;
          const isAccessible = step.number <= maxStepReached;

          const IconComp = step.icon;

          return (
            <React.Fragment key={step.number}>
              {/* Step Card / Pill */}
              <div
                id={`step-indicator-${step.number}`}
                onClick={() => {
                  if (isAccessible && step.number !== currentStep) {
                    onSelectStep(step.number);
                  }
                }}
                className={`flex-1 flex items-center gap-3 p-3 rounded-xl transition-all select-none ${
                  isActive
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/70 hover:bg-emerald-50 text-slate-800 border border-emerald-200 cursor-pointer'
                    : isAccessible
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer'
                    : 'bg-slate-50/50 text-slate-400 border border-slate-100 cursor-not-allowed opacity-70'
                }`}
              >
                {/* Step Circle / Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white border border-white/30'
                      : isCompleted
                      ? 'bg-[#064E3B] text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Step Text */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-black tracking-tight truncate ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] truncate ${
                      isActive ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>

              {/* Connecting Divider for Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center px-1 text-slate-300">
                  <div
                    className={`h-0.5 w-4 rounded-full ${
                      step.number < currentStep ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
