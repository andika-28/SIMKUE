import React from 'react';
import { Check, Calendar, Settings, Eye, CheckCircle2 } from 'lucide-react';
import { GenerateStep } from '../../types';

interface GenerateTagihanStepperProps {
  currentStep: GenerateStep;
  onStepClick?: (step: GenerateStep) => void;
}

interface StepDef {
  number: GenerateStep;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepDef[] = [
  {
    number: 1,
    title: 'Pilih Periode',
    subtitle: 'Tentukan periode tagihan',
    icon: Calendar,
  },
  {
    number: 2,
    title: 'Atur Tagihan & Diskon',
    subtitle: 'Konfigurasi nominal',
    icon: Settings,
  },
  {
    number: 3,
    title: 'Preview Tagihan',
    subtitle: 'Periksa sebelum generate',
    icon: Eye,
  },
  {
    number: 4,
    title: 'Konfirmasi',
    subtitle: 'Terbitkan tagihan',
    icon: CheckCircle2,
  },
];

export const GenerateTagihanStepper: React.FC<GenerateTagihanStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  // If in final success state (step 5), mark all 4 steps as completed
  const activeNumber = currentStep === 5 ? 5 : currentStep;

  return (
    <div
      id="generate-workflow-stepper"
      className="bg-white rounded-xl border border-[#E2E8F0] p-4 md:p-6 shadow-xs"
    >
      <div className="flex items-center justify-between relative max-w-4xl mx-auto">
        {STEPS.map((step, idx) => {
          const isCompleted = activeNumber > step.number;
          const isCurrent = activeNumber === step.number;
          const isFuture = activeNumber < step.number;
          const IconComp = step.icon;
          const isClickable = isCompleted && onStepClick;

          return (
            <React.Fragment key={step.number}>
              {/* Step Item */}
              <div
                id={`stepper-step-${step.number}`}
                onClick={() => {
                  if (isClickable) {
                    onStepClick(step.number);
                  }
                }}
                className={`flex flex-col items-center text-center group relative z-10 transition-all ${
                  isClickable ? 'cursor-pointer hover:opacity-90' : ''
                }`}
              >
                {/* Step Circle Indicator */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-[#064E3B] text-white ring-4 ring-emerald-50'
                      : isCurrent
                      ? 'bg-[#064E3B] text-white ring-4 ring-emerald-100 shadow-sm scale-105'
                      : 'bg-slate-100 text-[#64748B] border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white stroke-[2.5]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Step Title & Subtitle */}
                <div className="mt-2.5">
                  <div
                    className={`text-xs md:text-sm font-bold tracking-tight ${
                      isCurrent
                        ? 'text-[#064E3B]'
                        : isCompleted
                        ? 'text-[#0F172A]'
                        : 'text-[#64748B]'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] text-[#64748B] hidden sm:block mt-0.5 font-medium">
                    {step.subtitle}
                  </div>
                </div>

                {/* Active Indicator Underline */}
                {isCurrent && (
                  <div className="w-8 h-1 bg-[#064E3B] rounded-full mt-1.5 animate-pulse" />
                )}
              </div>

              {/* Connecting Horizontal Line between steps */}
              {idx < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2 md:mx-4 relative -top-4 sm:-top-5"
                  style={{ minWidth: '24px' }}
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      activeNumber > step.number
                        ? 'bg-[#064E3B]'
                        : 'bg-slate-200'
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
